# Mingle Dating App - MongoDB Database Schema Design

## Table of Contents
1. [Overview](#overview)
2. [MongoDB Technology Stack](#mongodb-technology-stack)
3. [Schema Design](#schema-design)
4. [Collection Definitions](#collection-definitions)
5. [Relationships & References](#relationships--references)
6. [Indexes](#indexes)
7. [API Endpoints Mapping](#api-endpoints-mapping)
8. [Migration Strategy](#migration-strategy)
9. [Security Considerations](#security-considerations)

## Overview

This document outlines the complete MongoDB database schema for the Mingle dating application. The current application uses localStorage for data persistence, which needs to be migrated to a proper MongoDB database.

### Current Data Flow Issues:
- All user data stored in browser localStorage
- Passwords stored in plaintext
- Profile photos stored as base64 strings
- No data validation or constraints
- No backup or recovery mechanism

### Target Architecture:
- MongoDB document database with flexible schema
- Secure password hashing
- Cloud-based file storage for images
- Document validation rules
- Scalable design for growth

## MongoDB Technology Stack

### Primary Choice: MongoDB
- **Pros**: Flexible schema, JSON-native, horizontal scaling, geospatial queries, aggregation pipeline
- **Use Case**: Perfect for dating app with varying user profile structures
- **Hosting**: MongoDB Atlas, AWS DocumentDB, Google Cloud Firestore

### Technology Stack:
- **Database**: MongoDB 6.0+
- **ODM**: Mongoose (Node.js) or Motor (Python)
- **Hosting**: MongoDB Atlas (recommended)
- **File Storage**: GridFS for large files, or cloud storage (S3/Cloudinary)
- **Search**: MongoDB Atlas Search for full-text search

## Schema Design

### Document Structure Overview
```
users (Collection)
├── Basic auth info
├── Profile data (embedded)
├── Photos (embedded array)
├── Interests (embedded array)
├── Personality responses (embedded array)
├── Social links (embedded object)
├── Preferences (embedded object)
└── Location (GeoJSON)

matches (Collection)
├── User references
├── Match metadata
└── Messages (embedded array or separate collection)

swipes (Collection)
├── Swiper reference
├── Swiped user reference
└── Action type

interests (Collection)
├── Predefined interests
└── Categories

reports (Collection)
├── Reporter reference
├── Reported user reference
└── Report details

blocks (Collection)
├── Blocker reference
├── Blocked user reference
└── Block metadata
```

## Collection Definitions

### 1. users Collection
**Purpose**: Core user data with embedded profile information

```javascript
{
  _id: ObjectId,
  email: String, // unique, required
  passwordHash: String, // bcrypt hashed
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String, // enum: ['male', 'female', 'non-binary', 'other']
  phoneNumber: String, // unique, optional
  emailVerified: Boolean, // default: false
  phoneVerified: Boolean, // default: false
  isActive: Boolean, // default: true
  lastLogin: Date,
  
  // Embedded profile data
  profile: {
    bio: String,
    jobTitle: String,
    education: String,
    location: {
      type: "Point",
      coordinates: [longitude, latitude], // GeoJSON format
      address: String
    },
    height: Number, // in centimeters
    drinking: String, // enum: ['never', 'socially', 'regularly']
    smoking: String, // enum: ['never', 'socially', 'regularly']
    religion: String,
    zodiacSign: String,
    politics: String,
    lookingFor: String, // enum: ['relationship', 'casual', 'friends']
    showMe: [String], // array of genders
    sexualOrientation: [String],
    ageRange: {
      min: Number, // default: 18
      max: Number  // default: 99
    },
    distanceRange: Number, // in km, default: 25
    profileCompletion: Number, // 0-100
    isPremium: Boolean, // default: false
    isVerified: Boolean // profile verification status
  },
  
  // Embedded photos array
  photos: [{
    _id: ObjectId,
    url: String, // cloud storage URL
    order: Number,
    isPrimary: Boolean,
    fileSize: Number,
    width: Number,
    height: Number,
    uploadedAt: Date,
    isVerified: Boolean
  }],
  
  // Embedded interests array
  interests: [{
    interestId: ObjectId, // reference to interests collection
    name: String, // denormalized for performance
    category: String
  }],
  
  // Embedded personality responses
  personalityResponses: [{
    _id: ObjectId,
    promptId: ObjectId, // reference to personality_prompts collection
    question: String, // denormalized
    response: String,
    isFeatured: Boolean,
    answeredAt: Date
  }],
  
  // Embedded social links
  socialLinks: {
    instagram: {
      username: String,
      url: String,
      isVerified: Boolean
    },
    spotify: {
      username: String,
      url: String,
      isVerified: Boolean
    },
    linkedin: {
      username: String,
      url: String,
      isVerified: Boolean
    }
  },
  
  // User preferences
  preferences: {
    pushNotifications: Boolean, // default: true
    emailNotifications: Boolean, // default: true
    showOnlineStatus: Boolean, // default: true
    showDistance: Boolean, // default: true
    discoveryEnabled: Boolean, // default: true
    locationSharing: Boolean, // default: true
    readReceipts: Boolean, // default: true
    themePreference: String, // enum: ['light', 'dark', 'system']
    language: String // default: 'en'
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
// Unique indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true })

// Performance indexes
db.users.createIndex({ isActive: 1 })
db.users.createIndex({ "profile.location": "2dsphere" }) // Geospatial
db.users.createIndex({ gender: 1, "profile.ageRange.min": 1, "profile.ageRange.max": 1 })
db.users.createIndex({ "photos.isPrimary": 1 })
```

**Validation Rules:**
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "firstName", "lastName", "dateOfBirth", "gender"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        gender: {
          enum: ["male", "female", "non-binary", "other"]
        },
        "profile.ageRange.min": {
          bsonType: "int",
          minimum: 18,
          maximum: 99
        },
        "profile.ageRange.max": {
          bsonType: "int",
          minimum: 18,
          maximum: 99
        },
        "photos": {
          bsonType: "array",
          maxItems: 6
        }
      }
    }
  }
})
```

### 2. matches Collection
**Purpose**: Mutual matches between users with embedded messaging

```javascript
{
  _id: ObjectId,
  users: [ObjectId, ObjectId], // array of 2 user IDs (always sorted)
  matchedAt: Date,
  isActive: Boolean, // default: true
  unmatchedBy: ObjectId, // user who unmatched
  unmatchedAt: Date,
  lastMessageAt: Date,
  
  // Option 1: Embedded messages (for smaller conversations)
  messages: [{
    _id: ObjectId,
    senderId: ObjectId,
    messageText: String,
    messageType: String, // enum: ['text', 'image', 'gif', 'sticker']
    isRead: Boolean,
    readAt: Date,
    sentAt: Date,
    editedAt: Date,
    isDeleted: Boolean
  }],
  
  // Message statistics
  messageStats: {
    totalMessages: Number,
    unreadCount: {
      [userId]: Number // unread count per user
    }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Alternative: Separate messages collection for large conversations**
```javascript
// For high-volume messaging, consider separate collection:
// messages collection (if message volume is high)
{
  _id: ObjectId,
  matchId: ObjectId, // reference to matches collection
  senderId: ObjectId,
  messageText: String,
  messageType: String,
  isRead: Boolean,
  readAt: Date,
  sentAt: Date,
  editedAt: Date,
  isDeleted: Boolean
}
```

**Indexes:**
```javascript
db.matches.createIndex({ users: 1 }, { unique: true })
db.matches.createIndex({ "users.0": 1, isActive: 1 })
db.matches.createIndex({ "users.1": 1, isActive: 1 })
db.matches.createIndex({ lastMessageAt: -1 })
db.matches.createIndex({ "messages.sentAt": -1 })

// If using separate messages collection:
db.messages.createIndex({ matchId: 1, sentAt: -1 })
db.messages.createIndex({ senderId: 1, sentAt: -1 })
db.messages.createIndex({ matchId: 1, isRead: 1 })
```

### 3. swipes Collection
**Purpose**: User swipe actions (like/pass/super_like)

```javascript
{
  _id: ObjectId,
  swiperId: ObjectId, // user who swiped
  swipedId: ObjectId, // user who was swiped
  action: String, // enum: ['like', 'pass', 'super_like']
  timestamp: Date,
  
  // Additional context
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  
  createdAt: Date
}
```

**Indexes:**
```javascript
db.swipes.createIndex({ swiperId: 1, swipedId: 1 }, { unique: true })
db.swipes.createIndex({ swipedId: 1, action: 1 })
db.swipes.createIndex({ swiperId: 1, timestamp: -1 })
db.swipes.createIndex({ timestamp: -1 }) // for cleanup of old swipes
```

**Validation:**
```javascript
db.createCollection("swipes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["swiperId", "swipedId", "action"],
      properties: {
        action: {
          enum: ["like", "pass", "super_like"]
        }
      }
    }
  }
})
```

### 4. interests Collection
**Purpose**: Predefined interest categories and tags

```javascript
{
  _id: ObjectId,
  name: String, // unique
  category: String, // e.g., 'hobbies', 'sports', 'lifestyle', 'entertainment'
  icon: String, // icon identifier
  isActive: Boolean, // default: true
  popularity: Number, // how many users have this interest
  createdAt: Date,
  updatedAt: Date
}
```

**Sample Data:**
```javascript
db.interests.insertMany([
  { name: "Photography", category: "hobbies", icon: "camera", isActive: true },
  { name: "Hiking", category: "sports", icon: "mountain", isActive: true },
  { name: "Cooking", category: "lifestyle", icon: "chef", isActive: true },
  { name: "Travel", category: "lifestyle", icon: "plane", isActive: true },
  { name: "Music", category: "entertainment", icon: "music", isActive: true }
])
```

**Indexes:**
```javascript
db.interests.createIndex({ name: 1 }, { unique: true })
db.interests.createIndex({ category: 1, isActive: 1 })
db.interests.createIndex({ popularity: -1 })
```

### 5. personality_prompts Collection
**Purpose**: Predefined personality questions for user responses

```javascript
{
  _id: ObjectId,
  question: String,
  category: String, // e.g., 'lifestyle', 'values', 'preferences'
  isActive: Boolean, // default: true
  popularity: Number, // how many users answered this prompt
  createdAt: Date,
  updatedAt: Date
}
```

**Sample Data:**
```javascript
db.personality_prompts.insertMany([
  { question: "What's your ideal Sunday?", category: "lifestyle", isActive: true },
  { question: "The key to my heart is...", category: "values", isActive: true },
  { question: "I'm weirdly attracted to...", category: "preferences", isActive: true },
  { question: "My perfect date would be...", category: "lifestyle", isActive: true },
  { question: "I'm passionate about...", category: "values", isActive: true }
])
```

**Indexes:**
```javascript
db.personality_prompts.createIndex({ category: 1, isActive: 1 })
db.personality_prompts.createIndex({ popularity: -1 })
```

### 6. reports Collection
**Purpose**: User reporting system for moderation

```javascript
{
  _id: ObjectId,
  reporterId: ObjectId, // user making the report
  reportedId: ObjectId, // user being reported
  reason: String, // enum: ['inappropriate_photos', 'fake_profile', 'harassment', 'spam', 'other']
  description: String, // additional details
  status: String, // enum: ['pending', 'reviewed', 'resolved', 'dismissed']
  reviewedBy: ObjectId, // admin user who reviewed
  reviewedAt: Date,
  
  // Evidence
  evidence: {
    screenshots: [String], // URLs to screenshot uploads
    messageIds: [ObjectId], // if reporting messages
    matchId: ObjectId // if reporting from a match
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.reports.createIndex({ reportedId: 1, status: 1 })
db.reports.createIndex({ reporterId: 1, createdAt: -1 })
db.reports.createIndex({ status: 1, createdAt: -1 })
db.reports.createIndex({ reviewedBy: 1, reviewedAt: -1 })
```

**Validation:**
```javascript
db.createCollection("reports", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["reporterId", "reportedId", "reason"],
      properties: {
        reason: {
          enum: ["inappropriate_photos", "fake_profile", "harassment", "spam", "other"]
        },
        status: {
          enum: ["pending", "reviewed", "resolved", "dismissed"]
        }
      }
    }
  }
})
```

### 7. blocks Collection
**Purpose**: Blocked users management

```javascript
{
  _id: ObjectId,
  blockerId: ObjectId, // user doing the blocking
  blockedId: ObjectId, // user being blocked
  reason: String, // optional reason
  createdAt: Date
}
```

**Indexes:**
```javascript
db.blocks.createIndex({ blockerId: 1, blockedId: 1 }, { unique: true })
db.blocks.createIndex({ blockedId: 1 }) // to check if user is blocked by others
db.blocks.createIndex({ blockerId: 1, createdAt: -1 })
```

## Relationships & References

### Document Relationships in MongoDB

#### 1. Embedded vs Referenced Data
```javascript
// Embedded approach (used in users collection)
// Good for: Data that belongs together, frequently accessed together
{
  _id: ObjectId("..."),
  email: "user@example.com",
  profile: { /* embedded profile data */ },
  photos: [ /* embedded photos array */ ]
}

// Referenced approach (used in matches, swipes)
// Good for: Many-to-many relationships, large datasets
{
  _id: ObjectId("..."),
  users: [ObjectId("user1"), ObjectId("user2")],
  matchedAt: Date
}
```

#### 2. Lookup Operations
```javascript
// Finding matches for a user with populated user data
db.matches.aggregate([
  { $match: { users: ObjectId("userId"), isActive: true } },
  { $lookup: {
      from: "users",
      localField: "users",
      foreignField: "_id",
      as: "matchedUsers"
    }
  },
  { $project: {
      "matchedUsers.passwordHash": 0, // exclude sensitive data
      "matchedUsers.preferences": 0
    }
  }
])
```

#### 3. Referential Integrity
Since MongoDB doesn't enforce foreign key constraints, implement application-level checks:

```javascript
// Example middleware to ensure referential integrity
async function validateUserReference(userId) {
  const user = await db.users.findOne({ _id: ObjectId(userId) });
  if (!user || !user.isActive) {
    throw new Error('Invalid user reference');
  }
}
```

## Indexes

### Performance Indexes

```javascript
// User collection indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true })
db.users.createIndex({ isActive: 1 })
db.users.createIndex({ "profile.location": "2dsphere" }) // Geospatial queries
db.users.createIndex({ 
  gender: 1, 
  "profile.ageRange.min": 1, 
  "profile.ageRange.max": 1 
}) // Discovery filters
db.users.createIndex({ "photos.isPrimary": 1 }) // Primary photo lookup
db.users.createIndex({ createdAt: -1 }) // Recent users
db.users.createIndex({ lastLogin: -1 }) // Active users

// Compound index for discovery algorithm
db.users.createIndex({
  isActive: 1,
  "preferences.discoveryEnabled": 1,
  "profile.location": "2dsphere",
  gender: 1,
  "profile.ageRange.min": 1,
  "profile.ageRange.max": 1
})

// Matches collection indexes
db.matches.createIndex({ users: 1 }, { unique: true })
db.matches.createIndex({ "users.0": 1, isActive: 1 })
db.matches.createIndex({ "users.1": 1, isActive: 1 })
db.matches.createIndex({ lastMessageAt: -1 })
db.matches.createIndex({ matchedAt: -1 })

// Swipes collection indexes
db.swipes.createIndex({ swiperId: 1, swipedId: 1 }, { unique: true })
db.swipes.createIndex({ swipedId: 1, action: 1 })
db.swipes.createIndex({ swiperId: 1, timestamp: -1 })
db.swipes.createIndex({ timestamp: -1 }) // TTL for cleanup

// Interests collection indexes
db.interests.createIndex({ name: 1 }, { unique: true })
db.interests.createIndex({ category: 1, isActive: 1 })
db.interests.createIndex({ popularity: -1 })

// Reports collection indexes
db.reports.createIndex({ reportedId: 1, status: 1 })
db.reports.createIndex({ reporterId: 1, createdAt: -1 })
db.reports.createIndex({ status: 1, createdAt: -1 })

// Blocks collection indexes
db.blocks.createIndex({ blockerId: 1, blockedId: 1 }, { unique: true })
db.blocks.createIndex({ blockedId: 1 })
db.blocks.createIndex({ blockerId: 1, createdAt: -1 })

// Text search indexes
db.users.createIndex({ 
  "profile.bio": "text", 
  "profile.jobTitle": "text",
  "interests.name": "text"
})
```

### TTL (Time To Live) Indexes
```javascript
// Auto-delete old swipes after 30 days
db.swipes.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 })

// Auto-delete inactive user sessions
db.users.createIndex({ lastLogin: 1 }, { 
  expireAfterSeconds: 31536000, // 1 year
  partialFilterExpression: { isActive: false }
})
```

## API Endpoints Mapping

### Authentication Endpoints
| Endpoint | MongoDB Operations |
|----------|-------------------|
| `POST /api/auth/register` | `db.users.insertOne()` with embedded profile |
| `POST /api/auth/login` | `db.users.findOne({ email })` |
| `POST /api/auth/verify-email` | `db.users.updateOne({ _id }, { $set: { emailVerified: true } })` |
| `POST /api/auth/forgot-password` | `db.users.findOne({ email })` + token generation |
| `POST /api/auth/reset-password` | `db.users.updateOne({ _id }, { $set: { passwordHash } })` |

### Profile Endpoints
| Endpoint | MongoDB Operations |
|----------|-------------------|
| `GET /api/profile/me` | `db.users.findOne({ _id }, { passwordHash: 0 })` |
| `PUT /api/profile/me` | `db.users.updateOne({ _id }, { $set: { "profile.field": value } })` |
| `GET /api/profile/photos` | `db.users.findOne({ _id }, { photos: 1 })` |
| `POST /api/profile/photos` | `db.users.updateOne({ _id }, { $push: { photos: newPhoto } })` |
| `DELETE /api/profile/photos/:photoId` | `db.users.updateOne({ _id }, { $pull: { photos: { _id: photoId } } })` |
| `PUT /api/profile/photos/:photoId/primary` | Multiple updates to set/unset primary photos |

### Discovery Endpoints
| Endpoint | MongoDB Operations |
|----------|-------------------|
| `GET /api/discovery` | Complex aggregation pipeline with geo queries and filtering |
| `POST /api/swipes` | `db.swipes.insertOne()` + match checking logic |

### Matching Endpoints
| Endpoint | MongoDB Operations |
|----------|-------------------|
| `GET /api/matches` | `db.matches.find({ users: userId }).populate()` |
| `DELETE /api/matches/:id` | `db.matches.updateOne({ _id }, { $set: { isActive: false } })` |

### Messaging Endpoints
| Endpoint | MongoDB Operations |
|----------|-------------------|
| `GET /api/messages/:matchId` | `db.matches.findOne({ _id: matchId }, { messages: 1 })` |
| `POST /api/messages` | `db.matches.updateOne({ _id }, { $push: { messages: newMessage } })` |
| `PUT /api/messages/:messageId/read` | `db.matches.updateOne({ "messages._id": messageId }, { $set: { "messages.$.isRead": true } })` |

### Complex Query Examples

#### Discovery Algorithm
```javascript
// Find potential matches for a user
db.users.aggregate([
  // Stage 1: Initial filtering
  {
    $match: {
      isActive: true,
      "preferences.discoveryEnabled": true,
      _id: { $ne: ObjectId(currentUserId) },
      gender: { $in: currentUser.profile.showMe }
    }
  },
  
  // Stage 2: Geographic filtering
  {
    $match: {
      "profile.location": {
        $near: {
          $geometry: currentUser.profile.location,
          $maxDistance: currentUser.profile.distanceRange * 1000 // km to meters
        }
      }
    }
  },
  
  // Stage 3: Age filtering
  {
    $match: {
      $expr: {
        $and: [
          { $gte: [{ $subtract: [new Date(), "$dateOfBirth"] }, currentUser.profile.ageRange.min * 365 * 24 * 60 * 60 * 1000] },
          { $lte: [{ $subtract: [new Date(), "$dateOfBirth"] }, currentUser.profile.ageRange.max * 365 * 24 * 60 * 60 * 1000] }
        ]
      }
    }
  },
  
  // Stage 4: Exclude already swiped users
  {
    $lookup: {
      from: "swipes",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$swiperId", ObjectId(currentUserId)] },
                { $eq: ["$swipedId", "$$userId"] }
              ]
            }
          }
        }
      ],
      as: "existingSwipe"
    }
  },
  {
    $match: { existingSwipe: { $size: 0 } }
  },
  
  // Stage 5: Exclude blocked users
  {
    $lookup: {
      from: "blocks",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                {
                  $and: [
                    { $eq: ["$blockerId", ObjectId(currentUserId)] },
                    { $eq: ["$blockedId", "$$userId"] }
                  ]
                },
                {
                  $and: [
                    { $eq: ["$blockerId", "$$userId"] },
                    { $eq: ["$blockedId", ObjectId(currentUserId)] }
                  ]
                }
              ]
            }
          }
        }
      ],
      as: "blocks"
    }
  },
  {
    $match: { blocks: { $size: 0 } }
  },
  
  // Stage 6: Calculate compatibility score
  {
    $addFields: {
      compatibilityScore: {
        $add: [
          // Interest compatibility
          {
            $size: {
              $setIntersection: ["$interests.name", currentUser.interests.map(i => i.name)]
            }
          },
          // Location bonus (closer = higher score)
          {
            $multiply: [
              {
                $subtract: [
                  currentUser.profile.distanceRange,
                  { $divide: [{ $multiply: ["$distance", 0.001] }, 1000] } // convert to km
                ]
              },
              0.1
            ]
          }
        ]
      }
    }
  },
  
  // Stage 7: Sort by compatibility and randomize
  {
    $sort: {
      compatibilityScore: -1,
      _id: 1 // for consistent pagination
    }
  },
  
  // Stage 8: Limit results
  { $limit: 50 },
  
  // Stage 9: Project only needed fields
  {
    $project: {
      passwordHash: 0,
      preferences: 0,
      "socialLinks": 0
    }
  }
])
```

#### Match Detection
```javascript
// Check if a swipe creates a match
async function checkForMatch(swiperId, swipedId, action) {
  if (action !== 'like') return null;
  
  // Find reciprocal like
  const reciprocalSwipe = await db.swipes.findOne({
    swiperId: ObjectId(swipedId),
    swipedId: ObjectId(swiperId),
    action: { $in: ['like', 'super_like'] }
  });
  
  if (reciprocalSwipe) {
    // Create match
    const match = await db.matches.insertOne({
      users: [ObjectId(swiperId), ObjectId(swipedId)].sort(),
      matchedAt: new Date(),
      isActive: true,
      messages: [],
      messageStats: {
        totalMessages: 0,
        unreadCount: {
          [swiperId]: 0,
          [swipedId]: 0
        }
      }
    });
    
    return match;
  }
  
  return null;
}
```

## Migration Strategy

### Phase 1: Core Collections Setup
1. **Create MongoDB database and collections**
   ```javascript
   // Create database
   use mingle_dating_app
   
   // Create collections with validation
   db.createCollection("users", { validator: userValidationSchema })
   db.createCollection("matches", { validator: matchValidationSchema })
   db.createCollection("swipes", { validator: swipeValidationSchema })
   db.createCollection("interests")
   db.createCollection("personality_prompts")
   db.createCollection("reports")
   db.createCollection("blocks")
   ```

2. **Set up indexes**
   ```javascript
   // Run all index creation commands
   // (See Indexes section above)
   ```

3. **Populate reference data**
   ```javascript
   // Insert interests
   db.interests.insertMany([...interestData])
   
   // Insert personality prompts
   db.personality_prompts.insertMany([...promptData])
   ```

### Phase 2: Data Migration from localStorage
1. **Extract localStorage data structure**
   ```javascript
   // Example localStorage data extraction
   const localStorageData = {
     userAccounts: JSON.parse(localStorage.getItem('userAccounts') || '{}'),
     basicSignupData: JSON.parse(localStorage.getItem('basicSignupData') || '{}'),
     completeProfileData: JSON.parse(localStorage.getItem('completeProfileData') || '{}'),
     // ... other localStorage keys
   };
   ```

2. **Transform and migrate user data**
   ```javascript
   // Migration script example
   async function migrateUsers() {
     const userAccounts = getLocalStorageData('userAccounts');
     
     for (const [email, userData] of Object.entries(userAccounts)) {
       // Transform localStorage structure to MongoDB document
       const mongoUser = {
         email: email,
         passwordHash: await bcrypt.hash(userData.password, 12), // Hash existing passwords
         firstName: userData.firstName,
         lastName: userData.lastName,
         dateOfBirth: new Date(userData.dateOfBirth),
         gender: userData.gender,
         
         profile: {
           bio: userData.bio || '',
           location: userData.location ? {
             type: "Point",
             coordinates: [userData.longitude || 0, userData.latitude || 0],
             address: userData.location
           } : null,
           // ... transform other profile fields
         },
         
         photos: userData.profilePhotos ? userData.profilePhotos.map((photo, index) => ({
           _id: new ObjectId(),
           url: photo, // Need to upload base64 to cloud storage first
           order: index + 1,
           isPrimary: index === 0,
           uploadedAt: new Date()
         })) : [],
         
         interests: userData.interests ? userData.interests.map(interest => ({
           interestId: findInterestId(interest), // Map to actual interest IDs
           name: interest,
           category: getInterestCategory(interest)
         })) : [],
         
         // ... transform other embedded data
         
         createdAt: new Date(),
         updatedAt: new Date()
       };
       
       await db.users.insertOne(mongoUser);
     }
   }
   ```

### Phase 3: Photo Migration to Cloud Storage
1. **Convert base64 images to cloud storage**
   ```javascript
   async function migratePhotos() {
     const users = await db.users.find({ "photos.url": { $regex: "^data:image" } });
     
     for (const user of users) {
       for (let i = 0; i < user.photos.length; i++) {
         const photo = user.photos[i];
         
         if (photo.url.startsWith('data:image')) {
           // Upload to cloud storage (Cloudinary, S3, etc.)
           const cloudUrl = await uploadBase64ToCloud(photo.url);
           
           // Update photo URL in database
           await db.users.updateOne(
             { _id: user._id, "photos._id": photo._id },
             { $set: { "photos.$.url": cloudUrl } }
           );
         }
       }
     }
   }
   ```

### Phase 4: API Integration
1. **Replace localStorage calls with API calls in frontend**
2. **Implement MongoDB ODM (Mongoose for Node.js)**
3. **Create API endpoints with proper validation**
4. **Add authentication middleware**

### Data Migration Helper Scripts

#### localStorage Data Extraction Script
```javascript
// Run this in browser console to extract localStorage data
function extractLocalStorageData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      data[key] = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      data[key] = localStorage.getItem(key);
    }
  }
  
  // Download as JSON file
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mingle_localStorage_backup.json';
  a.click();
}

extractLocalStorageData();
```

#### MongoDB Validation Schemas
```javascript
// User collection validation schema
const userValidationSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["email", "passwordHash", "firstName", "lastName", "dateOfBirth", "gender"],
    properties: {
      email: {
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      },
      passwordHash: { bsonType: "string", minLength: 60 },
      firstName: { bsonType: "string", minLength: 1, maxLength: 100 },
      lastName: { bsonType: "string", minLength: 1, maxLength: 100 },
      dateOfBirth: { bsonType: "date" },
      gender: { enum: ["male", "female", "non-binary", "other"] },
      "profile.ageRange.min": { bsonType: "int", minimum: 18, maximum: 99 },
      "profile.ageRange.max": { bsonType: "int", minimum: 18, maximum: 99 },
      "photos": { bsonType: "array", maxItems: 6 }
    }
  }
};
```

## Security Considerations

### Password Security
- Use bcrypt with salt rounds >= 12
- Implement password strength requirements
- Force password reset on first login after migration
- Add rate limiting on authentication endpoints

### MongoDB Security Best Practices
```javascript
// 1. Use MongoDB connection with authentication
const connectionString = "mongodb+srv://username:password@cluster.mongodb.net/mingle_dating_app";

// 2. Create database user with minimal privileges
db.createUser({
  user: "mingle_app",
  pwd: "strong_password",
  roles: [
    { role: "readWrite", db: "mingle_dating_app" }
  ]
});

// 3. Enable authentication and network access control
// In MongoDB Atlas: Configure IP whitelist and VPC peering

// 4. Use connection pooling and timeouts
const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

### Data Protection
```javascript
// 1. Field-level encryption for sensitive data
const encryptionSchema = {
  "properties": {
    "phoneNumber": {
      "encrypt": {
        "keyId": [UUID("...")], 
        "bsonType": "string",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
      }
    }
  }
};

// 2. Exclude sensitive fields from queries
const publicUserProjection = {
  passwordHash: 0,
  phoneNumber: 0,
  "preferences.emailNotifications": 0,
  "socialLinks.*.isVerified": 0
};

// 3. Input validation and sanitization
const userInputValidation = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  bio: { maxLength: 500, sanitize: true },
  messageText: { maxLength: 1000, sanitize: true }
};
```

### Privacy Controls
```javascript
// 1. GDPR Compliance - Data deletion
async function deleteUserData(userId) {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Remove user document
      await db.users.deleteOne({ _id: ObjectId(userId) });
      
      // Remove from matches
      await db.matches.deleteMany({ users: ObjectId(userId) });
      
      // Remove swipes
      await db.swipes.deleteMany({
        $or: [
          { swiperId: ObjectId(userId) },
          { swipedId: ObjectId(userId) }
        ]
      });
      
      // Remove reports and blocks
      await db.reports.deleteMany({
        $or: [
          { reporterId: ObjectId(userId) },
          { reportedId: ObjectId(userId) }
        ]
      });
      
      await db.blocks.deleteMany({
        $or: [
          { blockerId: ObjectId(userId) },
          { blockedId: ObjectId(userId) }
        ]
      });
    });
  } finally {
    await session.endSession();
  }
}

// 2. Data export functionality
async function exportUserData(userId) {
  const user = await db.users.findOne({ _id: ObjectId(userId) });
  const matches = await db.matches.find({ users: ObjectId(userId) });
  const swipes = await db.swipes.find({ swiperId: ObjectId(userId) });
  
  return {
    user: user,
    matches: matches,
    swipes: swipes,
    exportDate: new Date()
  };
}
```

### Access Control
```javascript
// 1. JWT-based authentication
const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign(
    { userId: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// 2. Role-based access middleware
function requireRole(role) {
  return async (req, res, next) => {
    const user = await db.users.findOne({ _id: req.userId });
    if (user && user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

// 3. Rate limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many authentication attempts'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests'
});
```

### MongoDB-Specific Security
```javascript
// 1. Query injection prevention
function sanitizeQuery(query) {
  // Remove any operator injections
  const sanitized = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string' && !key.startsWith('$')) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// 2. Aggregation pipeline security
function buildSecureAggregation(userId, filters) {
  return [
    // Always start with user-specific filtering
    { $match: { _id: ObjectId(userId) } },
    
    // Validate and sanitize filter stages
    ...filters.map(stage => {
      // Ensure no system collections access
      if (stage.$lookup && stage.$lookup.from.startsWith('system.')) {
        throw new Error('Invalid collection access');
      }
      return stage;
    })
  ];
}

// 3. Connection security
const mongoOptions = {
  ssl: true,
  sslValidate: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
};
```

## Performance Considerations

### Query Optimization
```javascript
// 1. Use explain() to analyze query performance
db.users.find({ "profile.location": { $near: ... } }).explain("executionStats");

// 2. Implement efficient pagination
async function getPaginatedMatches(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return await db.matches.aggregate([
    { $match: { users: ObjectId(userId), isActive: true } },
    { $sort: { lastMessageAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        let: { matchedUserId: { $arrayElemAt: [{ $filter: { input: "$users", cond: { $ne: ["$$this", ObjectId(userId)] } } }, 0] } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$matchedUserId"] } } },
          { $project: { passwordHash: 0, preferences: 0 } }
        ],
        as: "matchedUser"
      }
    }
  ]);
}

// 3. Use projection to limit data transfer
const lightUserProjection = {
  _id: 1,
  firstName: 1,
  "photos": { $slice: 1 }, // Only first photo
  "profile.bio": { $substr: ["$profile.bio", 0, 100] } // Truncated bio
};
```

### Caching Strategy
```javascript
// 1. Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

async function getCachedUser(userId) {
  const cached = await client.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const user = await db.users.findOne({ _id: ObjectId(userId) }, publicUserProjection);
  await client.setex(`user:${userId}`, 300, JSON.stringify(user)); // 5 min cache
  
  return user;
}

// 2. Implement cache invalidation
async function updateUserProfile(userId, updates) {
  await db.users.updateOne({ _id: ObjectId(userId) }, { $set: updates });
  await client.del(`user:${userId}`); // Invalidate cache
}
```

### Monitoring and Analytics
```javascript
// 1. Performance monitoring
const performanceMetrics = {
  queryTimes: new Map(),
  slowQueries: [],
  connectionPool: {
    active: 0,
    available: 0,
    created: 0
  }
};

// 2. Database health checks
async function healthCheck() {
  try {
    await db.admin().ping();
    const stats = await db.stats();
    return {
      status: 'healthy',
      connections: stats.connections,
      indexes: stats.indexes,
      dataSize: stats.dataSize
    };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

---

*This MongoDB schema document provides a complete foundation for backend developers to implement a scalable, secure dating application. The document emphasizes MongoDB's strengths in handling complex, nested data structures while maintaining performance and security.*
