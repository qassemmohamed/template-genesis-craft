import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layouts/navbar/Navbar";
import Banner from "@/components/layouts/Banner";
import About from "./About";
import Footer from "@/components/layouts/Footer";
import CallToAction from "@/components/layouts/CallToAction";
import FeaturesSection from "@/components/layouts/FeaturesSection";
import StatsSection from "@/components/layouts/StatsSection";
import Faqs1 from "@/components/layouts/FAQs";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-color-1)] to-[var(--gradient-color-2)]">
      <Navbar />
      <motion.main
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Banner />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FeaturesSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Faqs1 />
        </motion.div>
        <motion.div variants={itemVariants}>
          <About />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CallToAction />
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
