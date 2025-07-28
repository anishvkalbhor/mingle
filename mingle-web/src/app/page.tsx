import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">Mingle</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Your personalized social experience starts here.
        </p> 

        <SignedOut>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Link
              href="/sign-in"
              className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="w-full sm:w-auto border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg shadow hover:bg-indigo-50 transition-all font-medium"
            >
              Sign Up
            </Link> 
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center gap-5">
            <UserButton afterSignOutUrl="/" />
            <p className="text-green-700 font-semibold text-lg">
              You're signed in!
            </p>
            <Link
              href="/dashboard"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow"
            >
              Go to Dashboard
            </Link>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
