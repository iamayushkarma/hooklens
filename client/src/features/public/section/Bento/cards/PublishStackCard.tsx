import { motion } from "motion/react";
import { Check, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const platforms = [
  {
    icon: X,
    className: "bg-black text-white",
  },
  {
    icon: X,
    className: "bg-[#0A66C2] text-white",
  },
  {
    icon: () => <span className="text-[11px] font-bold text-black">B</span>,
    className: "bg-white border",
  },
  {
    icon: () => <span className="text-[11px] font-bold text-black">T</span>,
    className: "bg-white border",
  },
];

function PlatformBadge({ index }: { index: number }) {
  const platform = platforms[index];
  const Icon = platform.icon;

  return (
    <motion.div
      className={`absolute flex h-8 w-8 items-center justify-center rounded-lg shadow-md ${platform.className}`}
    >
      <Icon className="h-4 w-4" />
    </motion.div>
  );
}

function PostCard() {
  return (
    <div className="relative h-24 w-40 rounded-2xl border border-black/5 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
      <div className="flex gap-3 p-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-300 to-neutral-800" />

        <div className="flex flex-1 flex-col gap-2">
          <div className="h-2.5 w-12 rounded-full bg-neutral-300" />
          <div className="h-2 w-20 rounded-full bg-neutral-200" />
          <div className="h-2 w-16 rounded-full bg-neutral-200" />
        </div>

        <div className="text-neutral-400">×</div>
      </div>
    </div>
  );
}

function FloatingStack() {
  return (
    <div className="relative flex h-44 items-center justify-center">
      {/* Glow */}

      <div className="absolute h-44 w-56 rounded-full bg-[#4DA6FF]/20 blur-3xl" />

      {/* Back card */}

      <motion.div
        className="absolute"
        style={{
          right: -10,
          top: 34,
          zIndex: 1,
        }}
      >
        <PostCard />
      </motion.div>

      {/* Middle */}

      <motion.div
        className="absolute"
        style={{
          right: 12,
          top: 18,
          zIndex: 2,
        }}
      >
        <PostCard />
      </motion.div>

      {/* Front */}

      <motion.div className="absolute z-10">
        <PostCard />
      </motion.div>

      {/* Platform icons */}

      <PlatformBadge index={0} />
      <PlatformBadge index={1} />
      <PlatformBadge index={2} />
      <PlatformBadge index={3} />
    </div>
  );
}

export default function PublishStackCard() {
  return (
    <div className="w-[360px] rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
      <FloatingStack />

      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#3B82F6]">
        <Check className="h-4 w-4" />
        Published on 4 platforms
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900">
        Publish everywhere at once
      </h3>

      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Effortlessly cross-post to X, LinkedIn, Bluesky, Threads, and Mastodon.
      </p>
    </div>
  );
}
