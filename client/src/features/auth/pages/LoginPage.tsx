import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import authPatternOne from "@/assets/icons/auth-pattern-01.png";
import authPatterTwo from "@/assets/icons/auth-pattern-02.png";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/shared/validators/auth.validators";
import BackButton from "@/shared/components/ui/BackButton";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      if (inviteToken) {
        navigate(`/invite/accept/${inviteToken}`, {
          replace: true,
        });
        return;
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <section className="w-full">
      <div className="w-full flex flex-col md:flex-row min-h-screen relative">
        {/* Right section - hidden entirely below md, no blue sliver on mobile */}
        <div className="hidden md:flex md:w-1/2 items-center overflow-hidden bg-accent relative">
          <div className="w-3/4 p-8 lg:p-20 flex flex-col gap-3">
            <h2 className="text-white text-3xl lg:text-5xl font-bold">
              Good to See You Again
            </h2>
            <p className="text-gray-100">
              Everything is set up and ready to go. Access your account,
              continue your projects, and keep building without interruption.
            </p>
          </div>
          <img
            src={authPatternOne}
            className="size-32 lg:size-50 absolute top-[-50px]"
          />
          <img
            src={authPatterTwo}
            className="size-32 lg:size-50 absolute right-0 bottom-[-10px]"
          />
        </div>

        {/* Left section - form. min-h-screen ensures the card centers
            correctly on mobile even though the right panel is hidden */}
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-4 py-10 relative">
          <BackButton fallbackHref="/" className="absolute top-4 left-4" />

          <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-sm">
            {/* Heading section */}
            <div className="text-center mx-auto">
              <h2 className="text-xl sm:text-2xl font-medium md:font-semibold">
                Welcome back
              </h2>
              <p className="text-sm sm:text-base text-text-secondary">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Login form */}
            <div className="mx-auto mt-8 sm:mt-10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-4 flex-col"
              >
                <Input
                  label="E-mail"
                  id="email"
                  placeholder="Enter your Email"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Password"
                  placeholder="••••••••"
                  id="password"
                  isPassword={true}
                  error={errors.password?.message}
                  {...register("password")}
                />

                {errors.root && (
                  <p className="text-sm text-danger -mt-2">
                    {errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="select-none w-full"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex mx-auto mt-6 items-center gap-4">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-sm text-text-secondary whitespace-nowrap">
                Or sign up with
              </span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            {/* O-Auth */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 mt-5">
              <Button
                disabled={loading}
                onClick={async () => {
                  try {
                    await googleLogin();
                    if (inviteToken) {
                      navigate(`/invite/accept/${inviteToken}`, {
                        replace: true,
                      });
                      return;
                    }
                    navigate("/dashboard");
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className="bg-white w-full flex items-center justify-center text-[.95rem] hover:bg-gray-50 border border-border-subtle gap-3"
              >
                <FcGoogle className="size-5 shrink-0" />
                <span className="text-gray-950">
                  {loading ? "Signing in..." : "Sign in with Google"}
                </span>
              </Button>
              <Button
                onClick={() =>
                  toast("GitHub sign-in is coming soon", {
                    icon: "🚧",
                  })
                }
                className="bg-gray-950 w-full flex items-center justify-center text-[.95rem] hover:bg-gray-900 gap-3"
              >
                <FaGithub className="size-5 shrink-0" />
                <span>Sign in with GitHub</span>
              </Button>
            </div>

            {/* Register */}
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      inviteToken
                        ? `/register?invite=${inviteToken}`
                        : "/register",
                    )
                  }
                  className="font-medium text-accent hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
