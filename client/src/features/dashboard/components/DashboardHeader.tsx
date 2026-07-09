// import "@/features/dashboard/components/components.css";

// function DashboardHeader() {
//   return (
//     // <div className="h-30 w-full rounded-lg shadow-sm bg-gradient-to-r from-[#f4f6ff] to-[#dce3ff]">
//     //   DashboardHeader
//     // </div>
//     <div className="relative overflow-hidden rounded-2xl border border-border-default p-8">
//       {/* Background */}
//       <div className="absolute inset-0 bg-[#f8faff]" />

//       {/* Main Glow */}
//       <div className="absolute -right-32 -top-20 h-[450px] w-[450px] rounded-full bg-[#2633cb]/20 blur-[120px]" />

//       {/* Secondary Glow */}
//       <div className="absolute right-32 top-16 h-[250px] w-[250px] rounded-full bg-[#5260ff]/15 blur-[100px]" />

//       {/* Noise Layer */}
//       <div className="noise absolute inset-0" />

//       {/* Content */}
//       <div className="relative z-10">
//         <h1 className="text-3xl font-bold text-text-primary">
//           Welcome back 👋
//         </h1>

//         <p className="mt-2 text-text-secondary">
//           Monitor webhook traffic, inspect requests, and track endpoint
//           activity.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default DashboardHeader;

// import "@/features/dashboard/components/components.css";
import { MoreHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
}

export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-[1.5rem] font-semibold text-text-primary tracking-tight">
        Welcome back, {name}
      </h1>
      <button className="size-9 rounded-full bg-bg-sidebar flex items-center justify-center hover:bg-base-hover transition-colors">
        <MoreHorizontal className="size-4 text-text-secondary" />
      </button>
    </div>
  );
}
