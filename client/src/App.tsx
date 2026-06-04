import { useEffect } from "react";
import AppRouter from "./app/router/AppRouter";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return <AppRouter />;
};

export default App;
