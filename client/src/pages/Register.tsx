import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.fullName
    ) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      toast({ title: "Registration successful! Please login." });
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen ">
      <div className="m-auto w-full max-w-sm p-4">
        <div className="w-full">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="rounded-lg  p-6 shadow-md">
            <h1 className="mb-4 text-2xl font-bold ">
              Client Registration
            </h1>

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium "
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium "
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium "
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium "
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
