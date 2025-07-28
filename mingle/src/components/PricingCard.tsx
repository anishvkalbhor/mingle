import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const PricingCards = () => {
  const freeFeatures = [
    "AI-generated project briefs",
    "Basic editing",
    "Shareable links",
  ];

  const premiumFeatures = [
    "Including all free features",
    "No watermarks on shared links",
    "Section regeneration",
    "PDF export",
    "Email sharing",
  ];

  return (
    <div className="relative flex flex-col justify-center items-center px-4 sm:px-6 py-16 sm:py-24 min-h-screen lg:h-screen overflow-hidden">
      {/* Background Grid and Glow */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[250px] w-[250px] sm:h-[310px] sm:w-[310px] rounded-full bg-fuchsia-400 opacity-25 blur-[100px]" />

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 font-jakarta mb-10 sm:mb-16">
        Manage your plan
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full max-w-6xl px-2 sm:px-0">
        {/* Free Plan */}
        <Card className="flex-1 border border-white/20 bg-white/30 backdrop-blur-md shadow-xl rounded-3xl p-6 transition duration-300 hover:shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold font-urbanist text-gray-900">
              Free
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {freeFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-800 text-sm sm:text-base">
                <Check className="h-5 w-5 text-green-500" />
                {feature}
              </div>
            ))}
            <div className="flex items-center gap-3 text-purple-600 font-medium text-sm sm:text-base">
              🎨 5 generation credits/month
            </div>
          </CardContent>

          <div className="pt-10 sm:pt-12 mt-8 sm:mt-10 border border-gray-200 rounded-3xl px-4 sm:px-6 pb-6">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              $0{" "}
              <span className="text-sm sm:text-base font-normal text-gray-500">
                / month
              </span>
            </div>
            <Button className="w-full sm:w-1/2 h-12 bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-gray-100 pointer-events-none rounded-full cursor-default text-sm sm:text-base">
              Your current plan
            </Button>
          </div>
        </Card>

        {/* Premium Plan */}
        <div className="flex-1 relative">
          <div className="absolute -top-4 right-4 z-20 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold">
            Most Popular
          </div>

          <div className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-white border border-pink-300 shadow-2xl hover:shadow-pink-300/50 transition duration-300">
            <Card className="rounded-3xl flex flex-col justify-between p-6 h-full bg-transparent">
              <div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-urbanist text-gray-900">
                    Premium
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {premiumFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-800 text-sm sm:text-base">
                      <Check className="h-5 w-5 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-pink-600 font-medium text-sm sm:text-base">
                    🎨 25 generation credits/month
                  </div>
                </CardContent>
              </div>

              <div className="pt-10 sm:pt-12 mt-8 sm:mt-10 border border-gray-200 px-4 sm:px-6 pb-6 rounded-3xl">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  $3{" "}
                  <span className="text-sm sm:text-base font-normal text-gray-500">
                    / month
                  </span>
                </div>
                <Button className="w-full sm:w-1/2 h-12 relative overflow-hidden group bg-gradient-to-r from-pink-500 via-pink-400 to-rose-500 text-white rounded-full shadow-lg hover:brightness-110 transition text-sm sm:text-base">
                  <span className="relative z-10">Upgrade to Premium</span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 blur-sm animate-shine" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
