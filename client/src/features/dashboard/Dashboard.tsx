import ThemeSwitcher from "@/shared/components/ui/ThemeToggler";
import { useAuthStore } from "@/store/auth.store";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  return (
    <>
      <div className="text-red-500"> Wellcome {user?.fullName}</div>
      <ThemeSwitcher />
    </>
  );
}

export default Dashboard;
