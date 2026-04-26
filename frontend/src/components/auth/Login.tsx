import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// Interface untuk response error
interface ErrorResponse {
  message?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const response = await API.get("/budget/check");
      if (response.data.hasSetup) {
        navigate("/dashboard");
      } else {
        navigate("/setup-budget");
      }
    } catch (err) {
      // Cara sederhana: cek apakah err adalah object dengan response
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response: { data: ErrorResponse } };
        setError(axiosError.response.data.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-blue-50">
      <Card className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="flex justify-center mb-4">
            <img
              src="/LogoVura.jpeg"
              alt="KantongVura Logo"
              className="h-20 w-20 object-cover rounded-full"
            />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-center font-semibold">
            Login to your account
          </CardTitle>
          <CardDescription className="text-sm sm:text-sm text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm sm:text-base py-2 sm:py-3"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm hover:underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm sm:text-base py-2 sm:py-3 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              disabled={loading}
              size="lg"
            >
              {loading ? "Loading..." : "Login"}
            </Button>

            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
