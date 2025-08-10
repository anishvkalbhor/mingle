"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";
import { useRouter } from "next/navigation";
import { BackToHomeButton } from "./BackToHomeButton";

export const PricingCards = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 min-h-screen lg:h-screen overflow-hidden">
      <BackToHomeButton />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] rounded-full bg-fuchsia-400 opacity-25 blur-[100px]" />

      <div className="flex flex-col items-center w-full max-w-4xl space-y-6 sm:space-y-8">

        <div className="flex justify-center w-full px-2 sm:px-4 mb-8 sm:mb-12 mt-15">
          <div className="w-full max-w-3xl relative">
            <div className="absolute -top-3 right-4 z-20 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold">
              Most Popular
            </div>

            <div className="relative z-10 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-white border border-pink-300 shadow-2xl hover:shadow-pink-300/50 transition duration-300">
              <Card className="rounded-2xl flex flex-col justify-between p-4 sm:p-6 h-full bg-transparent">
              <div>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-urbanist text-gray-900 text-center">
                    Going Premium?
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-xs sm:text-sm rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-gradient-to-r from-pink-50 to-pink-100 border-b border-gray-200">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-800 ">
                            Feature
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-800">
                            Normal User
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-800">
                            Premium User
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          [
                            "**1. Daily Match Limit**",
                            "Up to 5 matches/day",
                            "Unlimited matches",
                          ],
                          [
                            "**2. Profile Visibility Boost**",
                            "Normal visibility",
                            "Top priority in suggestions",
                          ],
                          [
                            "**3. Chat Access**",
                            "Only 4 day after mutual match",
                            "Unlimited after mutual match",
                          ],
                          [
                            "**4. AI Matchmaking**",
                            "Basic compatibility",
                            "Advanced AI-based matching",
                          ],
                          [
                            "**5. Video Bio View**",
                            "Only mutual match profile",
                            "Unlock all video bios",
                          ],
                          [
                            "**6. Privacy Controls**",
                            "Basic (online/offline)",
                            "Hide age, location, last seen",
                          ],
                          [
                            "**7. Premium Badge**",
                            "❌ Not available",
                            "✅ Trust-enhancing Premium Badge",
                          ],
                        ].map(([feature, normal, premium], i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0
                                ? "bg-white"
                                : "bg-pink-50 hover:bg-pink-100 transition"
                            }
                          >
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm text-left font-bold">
                              {feature.replace(/\*\*/g, "")}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-600 text-xs sm:text-sm">
                              {normal}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold text-pink-600 text-xs sm:text-sm">
                              {premium}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border border-gray-200 px-4 sm:px-6 pb-4 sm:pb-6 rounded-2xl bg-white/50 backdrop-blur">
                <div className="text-center mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    $3{" "}
                    <span className="text-sm sm:text-base font-normal text-gray-500">
                      / month
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full h-10 sm:h-12 relative overflow-hidden group bg-gradient-to-r from-pink-500 via-pink-400 to-rose-500 text-white rounded-full shadow-lg hover:brightness-110 transition text-sm sm:text-base"
                  onClick={() => router.push("/premium")}
                >
                  <span className="relative z-10">Upgrade to Premium</span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 blur-sm animate-shine" />
                </Button>
              </div>
              <BorderBeam
                duration={8}
                size={200}
                colorFrom="#ffaa40"
                colorTo="#9c40ff"
                borderWidth={3}
              />
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
