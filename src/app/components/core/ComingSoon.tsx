/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Dq5ke8S7hnB
 */
import { Badge } from "@/components/ui/badge";

export default function ComingSoon() {
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(/placeholder.svg?height=1080&width=1920)",
      }}
    >
      <main className="flex-1 flex items-center justify-center text-center p-4 md:p-6 lg:p-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-white">
            We are working hard to give you the best experience.
          </p>
          <Badge>
            <TimerIcon className="h-4 w-4" />
            <span className="ml-2">Countdown: 10 Days</span>
          </Badge>
        </div>
      </main>
    </div>
  );
}

function TimerIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  );
}
