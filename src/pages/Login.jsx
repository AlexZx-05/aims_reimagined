import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = loginUser(email, password);

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-teal-500 p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="AIMS" className="w-32 mb-2" />
          <h2 className="text-2xl font-semibold">Login to Account</h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Email address:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="●●●●●●●"
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <Button className="w-full py-3" onClick={handleLogin}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
