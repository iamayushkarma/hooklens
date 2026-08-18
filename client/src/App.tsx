import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import AppRouter from "./app/router/AppRouter";
import { useAuthStore } from "./store/auth.store";
import useOnlineStatus from "./shared/hooks/useOnlineStatus";
import OfflinePage from "./features/public/pages/OfflinePage";

const App = () => {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  const isOnline = useOnlineStatus();

  if (!isOnline) return <OfflinePage />;
  if (!initialized) return;
  return (
    <>
      <AppRouter />
      <Toaster position="top-center" />
      <Analytics />
    </>
  );
};

export default App;
