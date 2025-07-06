import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
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
