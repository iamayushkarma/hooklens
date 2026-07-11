import logo from "@/assets/icons/logo-icon.png";

function Navbar() {
  return (
    <nav className="w-full border-b border-border-default bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="HookLens" className="w-6 h-6" />
          <span className="font-semibold text-text-primary text-[15px]">
            HookLens
          </span>
        </div>

        {/* Middle nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            How it Works
          </a>
          <a
            href="#"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Use Cases
          </a>
          <a
            href="#"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
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
