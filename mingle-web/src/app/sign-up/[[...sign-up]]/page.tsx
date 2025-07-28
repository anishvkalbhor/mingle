'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-md">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
        />
      </div>

      <Link
        href="/"
        className="mt-6 text-sm text-blue-600 font-medium hover:underline transition"
      >
        ← Home
      </Link>
    </div>
  );
}
