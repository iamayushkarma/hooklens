import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import { useAuthStore } from "@/store/auth.store";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  return (
    <>
      <h1>Dashboard Home</h1>
      <ThemeSwitcher />
    </>
  );
}

export default Dashboard;
