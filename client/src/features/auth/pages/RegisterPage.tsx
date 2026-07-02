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
  registerSchema,
  type RegisterFormData,
} from "@/shared/validators/auth.validators";

function RegisterPage() {
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const register = useAuthStore((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.fullName, data.email, data.password);
      if (inviteToken) {
        navigate(`/invite/accept/${inviteToken}`, {
          replace: true,
        });
        return;
      }
      navigate("/login");
    } catch (err: any) {
      setError("root", {
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="w-full">
      <div className="w-full flex max-sm:flex-col md:p-6 min-h-screen relative">
        {/* Right section */}
        <div className="w-full max-sm:h-40 md:w-1/2 flex items-center overflow-hidden bg-accent md:rounded-xl relative">
          <div className="md:w-3/4 p-8 md:p-20 flex flex-col gap-3">
            <h2 className="text-white text-2xl md:text-5xl font-bold">
              Start Building Today
            </h2>
            <p className="md:hidden text-gray-100">
              Create your account and get started.
            </p>
            <p className="hidden md:block text-gray-100">
              Join thousands of developers already using the platform. Create
              your account and start building without interruption.
            </p>
          </div>
          <img
            src={authPatternOne}
            className="hidden md:block size-50 absolute top-[-50px]"
          />
          <img
            src={authPatterTwo}
            className="hidden md:block size-50 absolute right-0 bottom-[-10px]"
          />
        </div>

        {/* Left section */}
        <div className="w-[90%] mx-auto md:w-1/2 bg-bg-base relative">
          <div className="flex items-center rounded-lg w-full md:h-full justify-center max-sm:bg-[#1c1c1a] max-sm:p-3 max-sm:absolute max-sm:top-2 max-sm:-mt-10 relative z-20">
            <div className="w-96 py-8">
              {/* Heading section */}
              <div className="text-center mx-auto">
                <h2 className="text-2xl font-medium md:font-semibold">
                  Create an account
                </h2>
                <p>Fill in your details to get started.</p>
              </div>

              {/* Register form */}
              <div className="mx-auto mt-10">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex gap-4 flex-col"
                  action=""
                >
                  <Input
                    label="Full name"
                    id="name"
                    placeholder="Enter your full name"
                    error={errors.fullName?.message}
                    {...registerField("fullName")}
                  />
                  <Input
                    label="E-mail"
                    id="email"
                    placeholder="Enter your Email"
                    error={errors.email?.message}
                    {...registerField("email")}
                  />
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    id="password"
                    isPassword={true}
                    error={errors.password?.message}
                    {...registerField("password")}
                  />
                  <Input
                    label="Confirm password"
                    placeholder="••••••••"
                    id="confirmPassword"
                    isPassword={true}
                    error={errors.confirmPassword?.message}
                    {...registerField("confirmPassword")}
                  />

                  {errors.root && (
                    <p className="text-sm text-danger -mt-2">
                      {errors.root.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="select-none"
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </div>

              {/* Divider */}
              <div className="flex mx-auto mt-6 items-center gap-4">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-sm text-text-secondary">
                  Or sign up with
                </span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>

              {/* O-Auth */}
              <div className="flex md:flex-col gap-3 mt-5">
                <Button
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
                  className="bg-white flex items-center justify-center text-[.95rem] hover:bg-gray-50 border border-border-subtle gap-3"
                >
                  <FcGoogle className="size-5" />
                  {/* Mobile */}
                  <span className="text-gray-950 sm:hidden">Google</span>
                  {/* Tablet and Desktop */}
                  <span className="text-gray-950 hidden sm:inline">
                    Sign up with Google
                  </span>
                </Button>
                <Button className="bg-gray-950 flex items-center justify-center text-[.95rem] hover:bg-gray-900 gap-3">
                  <FaGithub className="size-5" />
                  {/* Mobile */}
                  <span className="sm:hidden">Github</span>
                  {/* Tablet and Desktop */}
                  <span className="hidden sm:inline">Sign up with Github</span>
                </Button>
              </div>

              {/* Login */}
              <div className="mt-10 md:mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        inviteToken ? `/login?invite=${inviteToken}` : "/login",
                      )
                    }
                    className="font-medium text-accent hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
