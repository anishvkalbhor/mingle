<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Dating App Backend

A modern, secure, and scalable backend for a dating application built with Node.js, Express, MongoDB, and TypeScript.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: Clerk
- **Language**: TypeScript
- **API Documentation**: OpenAPI/Swagger

## Features

- User authentication with Clerk
- User profile management
- Phone number verification
- Secure routes with authentication middleware
- MongoDB integration for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Clerk Account
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dating-app
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=development
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dating-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Routes
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/complete-profile` - Complete user profile setup

### User Routes
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/verify-phone` - Verify user's phone number
- `DELETE /api/users/account` - Delete user account

## Data Models

### User Model
```typescript
interface IUser {
  clerkId: string;
  email: string;
  username: string;
  bio: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    others?: string;
  };
  occupation: 'working' | 'student' | 'self employed';
  occupationDetails: {
    organizationName?: string;
    instituteName?: string;
    degree?: string;
  };
  phoneNumber: string;
  dateOfBirth?: Date;
  profilePhoto: string;
  state: string;
  profileComplete: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Features

- Clerk Authentication Integration
- CORS Protection
- Environment Variable Management
- Error Handling Middleware
- Request Validation
- Rate Limiting

## Error Handling

The API uses a standardized error response format:

```typescript
interface IApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Structure

```
src/
├── server.ts         # Application entry point
├── models/          # Database models
├── routes/          # API route handlers
└── types/           # TypeScript type definitions
```

## API Response Format

All API responses follow a consistent format:

```typescript
{
  status: 'success' | 'error',
  message?: string,
  data?: T
}
```

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
>>>>>>> 9d3655c (Full FrontEnd + BackEnd upto chatroom)
