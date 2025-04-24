
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { LucideMoon, SunIcon } from "lucide-react";

export default function AnimatedThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const IconComponent = theme === "light" ? LucideMoon : SunIcon;

  return (
    <motion.div
      onClick={toggleMode}
      className="flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[var(--button)] p-2 text-sm font-bold text-[var(--button-text)] max-md:border-none max-md:bg-transparent max-md:p-0 max-md:text-[var(--headline)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconComponent className="h-6 w-6 cursor-pointer" size={25} />
      </motion.div>
    </motion.div>
  );
}
