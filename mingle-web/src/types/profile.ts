export interface Profile {
  id: string;
  fullPhotoUrl: string;
  bio: string;
  interests: string[];
  social: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  traits: string[]; // e.g., ["Loves hiking", "Introvert", "Techie"]
}
