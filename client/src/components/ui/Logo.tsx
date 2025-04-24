import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Logo = () => (
  <Link to="/">
    <div className="flex cursor-pointer w-max select-none items-center justify-start gap-2">
      <img className="h-6 w-6" src={logo} alt="SamTax logo" />
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-[var(--headline)]"
      >
        SamTax
      </motion.h1>
    </div>
  </Link>
);

export default Logo;
