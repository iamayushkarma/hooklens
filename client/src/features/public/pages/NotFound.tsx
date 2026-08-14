import { Button } from "@/shared/components/ui/Button";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

function NotFound() {
  const { goToHome } = useAppNavigation();
  return (
    <div className="min-h-screen w-full bg-bg-base font-sans antialiased flex items-center justify-center px-6">
      <style>{`
        .stroke-404 {
          color: transparent;
          -webkit-text-stroke: 1.5px var(--color-text-primary);
        }
        @media (min-width: 480px) {
          .stroke-404 { -webkit-text-stroke: 2px var(--color-text-primary); }
        }
        @media (min-width: 640px) {
          .stroke-404 { -webkit-text-stroke: 3px var(--color-text-primary); }
        }
      `}</style>

      <div className="flex flex-col items-center text-center max-w-full">
        <h1 className="stroke-404 text-[88px] xs:text-[110px] sm:text-[180px] leading-none font-extrabold tracking-tight">
          404
        </h1>

        <div className="mt-6 h-px w-16 bg-border-strong" />

        <p className="mt-6 text-sm sm:text-md text-text-secondary max-w-xs sm:max-w-none px-2 sm:px-0">
          This route doesn't exist. Even our capture handler couldn't catch it.
        </p>
        <Button className="mt-6" onClick={goToHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
