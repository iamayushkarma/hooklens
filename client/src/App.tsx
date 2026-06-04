import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return <></>;
};

export default App;
