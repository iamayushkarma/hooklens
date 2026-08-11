import { useEffect } from "react";
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
  return <AppRouter />;
};

export default App;
