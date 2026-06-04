import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return <div className="">HookLens</div>;
};

export default App;
