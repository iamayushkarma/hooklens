import { RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

function OfflinePage() {
  return (
    <div className="fixed inset-0 z-[100] bg-bg-base flex flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
      <div className="w-14 h-14 shrink-0 rounded-full bg-bg-surface flex items-center justify-center mb-5">
        <WifiOff className="size-6 text-text-secondary" />
      </div>
      <h1 className="text-xl font-semibold text-text-primary tracking-tight">
        You're offline
      </h1>
      <p className="text-sm text-text-secondary mt-2 max-w-xs leading-relaxed">
        Check your connection. Any requests you're capturing won't update live
        until you're back online.
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-6 flex items-center gap-2"
      >
        <RotateCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

export default OfflinePage;
