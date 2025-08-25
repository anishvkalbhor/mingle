import { SignUp } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#ec4899",
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#1f2937",
                colorTextSecondary: "#6b7280",
                borderRadius: "0.5rem",
              },
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0",
                card: "shadow-xl border-0",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:bg-gray-50",
                formFieldInput:
                  "border border-gray-300 focus:border-pink-500 focus:ring-pink-500",
                footerActionLink: "text-pink-600 hover:text-pink-700",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
