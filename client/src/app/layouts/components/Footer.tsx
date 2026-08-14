import { Link } from "react-router-dom";
import logo from "@/assets/icons/logo-icon.png";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Live Capture", href: "/learn-more#live-capture" },
      { label: "Replay Engine", href: "/learn-more#replay" },
      { label: "Features", href: "/#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/learn-more" },
      { label: "FAQ", href: "/#faq" },
      {
        label: "Support",
        href: "mailto:ayushkarma.dev@gmail.com",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/iamayushkarma/hooklens",
        external: true,
      },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

function Footer() {
  const { goToHome } = useAppNavigation();
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 sm:gap-12">
          {/* Left: logo, tagline, icons */}
          <div className="max-w-xs">
            <div
              onClick={goToHome}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={logo} alt="HookLens" className="w-6 h-6" />
              <span className="font-semibold text-[#ececec] text-xl">
                HookLens
              </span>
            </div>
            <p className="text-sm text-[#a1a1aa] mt-4 leading-relaxed">
              HookLens captures and replays webhooks in real time - making
              integration debugging faster and easier.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                aria-label="GitHub"
                className="text-[#71717a] hover:text-[#ececec] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Email"
                className="text-[#71717a] hover:text-[#ececec] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: link columns */}
          <div className="flex flex-wrap gap-x-12 sm:gap-x-16 lg:gap-x-20 gap-y-8 sm:gap-y-10">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-[#ececec] mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) =>
                    link.external ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            link.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-sm text-[#a1a1aa] hover:text-[#ececec] transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-sm text-[#a1a1aa] hover:text-[#ececec] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-8 sm:mt-10 select-none pointer-events-none overflow-hidden">
          <p className="font-semibold leading-none tracking-tight text-white/5 text-[22vw] sm:text-[16vw] whitespace-nowrap">
            HookLens
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6 border-t border-[#262626] text-xs tracking-wide text-[#71717a]">
          <p>© 2026 HookLens. All rights reserved.</p>
          <p>Built for developers who ship integrations.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
