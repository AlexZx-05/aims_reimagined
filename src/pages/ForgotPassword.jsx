import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { requestPasswordReset } from "../utils/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    setError("");
    setMessage("");
    if (!email) return setError("Please enter your email.");

    const ok = requestPasswordReset(email);
    if (!ok) {
      setError("Email not found. Please check and try again.");
      return;
    }

    setMessage("Password reset link sent to your email (simulated).");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-teal-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="AIMS" className="w-32 mb-2" />
          <h2 className="text-2xl font-semibold">Forgot Password</h2>
          <p className="text-sm text-gray-600">Enter your email to receive reset instructions.</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <div className="flex gap-3">
            <Button onClick={handleReset} className="flex-1">Send Reset Link</Button>
            <Button onClick={() => navigate('/')} className="flex-1 bg-gray-600 hover:bg-gray-500">Back</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
