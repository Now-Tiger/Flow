"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Using requestAnimationFrame ensures the paint cycle is ready
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted;
}

export default function ThemeTogger() {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  return (
    <>
      <button
        aria-label="Toggle Theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg dark:bg-slate-800 bg-slate-50 hover:bg-slate-100/20 border border-purple-500/20 transition-all duration-300 flex items-center justify-center w-10 h-10"
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isMounted ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Laptop className="w-5 h-5 text-slate-400" />
            </motion.div>
          ) : theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-yellow-300" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-blue-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
