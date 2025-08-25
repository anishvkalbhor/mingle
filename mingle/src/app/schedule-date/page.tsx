
"use client";

import { useSearchParams } from "next/navigation";
import DateScheduler from "@/components/DateScheduler";
import { BackToHomeButton } from "@/components/BackToHomeButton";

export default function Home() {
  const searchParams = useSearchParams();
  const partnerName = searchParams.get('partner');
  const partnerId = searchParams.get('partnerId');

  return (
    <main className="h-screen relative p-2 sm:p-4 overflow-hidden">
      <BackToHomeButton />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      
      <DateScheduler partnerName={partnerName} partnerId={partnerId} />
    </main>
  );
} 