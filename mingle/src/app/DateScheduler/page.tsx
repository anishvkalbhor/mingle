import DateScheduler from "@/components/DateScheduler";
import { BackToHomeButton } from "@/components/BackToHomeButton";

export default function DateSchedulerPage() {
  return (
    <div className="relative h-screen overflow-hidden">
      <BackToHomeButton />
      <DateScheduler />
    </div>
  );
}
