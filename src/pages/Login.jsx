import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Captcha: simple math question (sum of two numbers)
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const handleLogin = () => {
    setError("");
    setCaptchaError("");

    // Validate captcha first
    const expected = Number(captchaA) + Number(captchaB);
    if (Number(captchaInput) !== expected) {
      setCaptchaError("Captcha incorrect. Please try again.");
      return;
    }

    const user = loginUser(email, password);

    if (!user) {
      setError("Invalid email or password");
      // regenerate captcha on failed login
      generateCaptcha();
      return;
    }

    navigate("/dashboard");
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaA(a);
    setCaptchaB(b);
    setCaptchaInput("");
    setCaptchaError("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

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

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Captcha: </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-gray-100 rounded">{captchaA} + {captchaB} =</div>
              <input
                className="w-24 px-2 py-2 border border-gray-300 rounded bg-white"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Answer"
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-sm text-blue-600 underline"
              >
                Refresh
              </button>
            </div>
          </div>

          {captchaError && (
            <p className="text-red-600 text-sm">{captchaError}</p>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button className="w-full py-3" onClick={handleLogin}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
