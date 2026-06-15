import logo from "@/assets/icons/logo-icon.png";
import { AnimatePresence, motion } from "framer-motion";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

function HookLensLogo() {
  const { goToDashboard } = useAppNavigation();
  return (
    <div className="py-3 md:px-4.5 flex justify-between items-center h-14 gap-2 border-b border-border-default">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => goToDashboard()}
          className="flex items-center gap-1.5 cursor-pointer overflow-hidden"
        >
          <img src={logo} className="w-5 shrink" />
          <h1 className="font-semibold whitespace-nowrap">HookLens</h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default HookLensLogo;
