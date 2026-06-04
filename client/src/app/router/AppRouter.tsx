import { BrowserRouter } from "react-router-dom";
import { appRoutes } from "./routes";

function AppRouter() {
  return <BrowserRouter>{appRoutes}</BrowserRouter>;
}

export default AppRouter;
