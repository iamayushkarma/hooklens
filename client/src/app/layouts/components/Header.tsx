import NotificationBell from "@/features/notification/components/NotificationBell";
import HookLensLogo from "@/shared/components/ui/HookLensLogo";
import { Menu } from "lucide-react";

interface HeaderProps {
  mobileOpen: boolean;
  onMobileMenuOpen: () => void;
}

export function Header({ mobileOpen, onMobileMenuOpen }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border-default flex items-center justify-between px-4 gap-3">
      <HookLensLogo />

      <div className="flex items-center gap-2">
        <NotificationBell />

        <button
          onClick={onMobileMenuOpen}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
        >
          {!mobileOpen && <Menu className="size-5" />}
        </button>
      </div>
    </header>
  );
}
