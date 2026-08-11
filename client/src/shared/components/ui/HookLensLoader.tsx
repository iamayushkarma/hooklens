function HookLensLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-bg-base flex items-center justify-center">
      <style>{`
        @keyframes shimmerSlow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <span className="text-5xl font-medium bg-clip-text text-transparent bg-[length:200%_100%] [animation:shimmerSlow_4.2s_linear_infinite] bg-[linear-gradient(90deg,var(--color-text-muted)_0%,var(--color-text-muted)_35%,var(--color-text-primary)_50%,var(--color-text-muted)_65%,var(--color-text-muted)_100%)]">
        HookLens
      </span>
    </div>
  );
}

export default HookLensLoader;
