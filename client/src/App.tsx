import { useEffect } from "react";
import AppRouter from "./app/router/AppRouter";
import { useAuthStore } from "./store/auth.store";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) return "loading...";
  return <AppRouter />;
};

export default App;
