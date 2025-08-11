import { SignIn } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { SparklesText } from "@/components/ui/sparkles-text"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Heart className="h-8 w-8 text-purple-500 fill-current" />
            </div>
            <div className="relative">
              <SparklesText className="text-2xl font-extrabold font-urbanist tracking-tight text-purple-600" colors={{ first: "#9333EA", second: "#EC4899" }}>
                Mingle
              </SparklesText>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>
        
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#ec4899', // Pink-500
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#1f2937',
              colorTextSecondary: '#6b7280',
              borderRadius: '0.5rem',
            },
            elements: {
              formButtonPrimary: 
                'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0',
              card: 'shadow-xl border-0',
              headerTitle: 'text-gray-900',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 
                'border border-gray-300 hover:bg-gray-50',
              formFieldInput: 
                'border border-gray-300 focus:border-pink-500 focus:ring-pink-500',
              footerActionLink: 
                'text-pink-600 hover:text-pink-700',
            }
          }}
        />
      </div>
    </div>
  )
}
