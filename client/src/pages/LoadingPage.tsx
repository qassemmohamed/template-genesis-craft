import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import Navbar from "@/components/layouts/navbar/Navbar";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 m-auto flex h-[100vh] w-[100vw] flex-col items-center justify-center overflow-hidden bg-[var(--background)] font-semibold text-[var(--headline)]">
      <div className="hidden">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.img
          src={logo}
          className="h-10 w-10 logo-loader"
          alt="Logo"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            opacity: {
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
        />
      </div>
    </div>
  );
}
