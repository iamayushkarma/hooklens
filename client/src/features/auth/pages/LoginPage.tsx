import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      LoginPage
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="border-2 border-white px-3 py-1.5"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******"
            className="border-2 border-white px-3 py-1.5"
          />
        </div>
        <button type="submit" className="px-3 py-2 bg-accent mt-4 w-full">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
