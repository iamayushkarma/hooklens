import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import logo from "@/assets/icons/logo-icon.png";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

const navLinks = [
  { label: "Features", href: "#" },
  { label: "How it Works", href: "#" },
  { label: "Use Cases", href: "#" },
  { label: "FAQ", href: "#" },
];

function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { goToHome } = useAppNavigation();
  return (
    <nav className="w-full border-b border-border-default bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center justify-center gap-10">
          <div
            onClick={goToHome}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <img src={logo} alt="HookLens" className="w-6 h-6" />
            <span className="font-semibold text-text-primary text-[15px]">
              HookLens
            </span>
          </div>

          <LayoutGroup id="navbar-links">
            <div
              className="hidden md:flex items-center gap-1 px-2"
              onMouseLeave={() => setHovered(null)}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.label)}
                  className="relative px-3 py-1.5 text-sm"
                >
                  {hovered === link.label && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 rounded-md bg-bg-sidebar pointer-events-none"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      hovered === link.label
                        ? "text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Login
          </a>
          <button className="h-9 px-4 rounded-md bg-accent text-white text-sm hover:bg-accent-hover transition-colors cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
