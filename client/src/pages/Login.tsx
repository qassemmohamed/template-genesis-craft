import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "@/components/layouts/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!username || !password) {
      toast({
        title: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login({ username, password });

      if (success) {
        // Success animation before redirect
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });

        // Delay navigation slightly for better UX
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Login page illustration
  const LoginIllustration = () => (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative h-64 w-64">
        <div className="absolute inset-8 flex items-center justify-center rounded-full bg-primary/30">
          img
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout illustration={<LoginIllustration />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full overflow-hidden border shadow-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader>
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="relative">
                    <motion.div
                      animate={{
                        x: focusedField === "username" ? [-1, 1, -1, 1, 0] : 0,
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.995 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Input
                        id="username"
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        required
                        className="border-2 pl-10 transition-all duration-300 focus:border-primary/70"
                      />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {username === "" && formSubmitted && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-red-500"
                      >
                        Username is required
                      </motion.p>
                    )}
                    {username === "" && !formSubmitted && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-muted-foreground"
                      >
                        Enter your username or email address
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="relative">
                    <motion.div
                      whileTap={{ scale: 0.995 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        required
                        className="border-2 pr-10 transition-all duration-300 focus:border-primary/70"
                      />
                    </motion.div>
                    <motion.button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {password === "" && formSubmitted && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-red-500"
                      >
                        Password is required
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center justify-end">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Signing in...</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="signin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <span>Sign In</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Button background animation */}
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <CardFooter className="flex justify-center border-t p-4">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Create account
                  </Link>
                </motion.span>
              </div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
