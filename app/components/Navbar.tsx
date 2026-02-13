"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Laptop, SquareDashedMousePointer } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * A robust way to handle hydration in NextJS to prevent
 * "cascading render" and "hydration mismatch" errors.
 */
function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Using requestAnimationFrame ensures the paint cycle is ready
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted;
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "App", href: "/flow" },
    { name: "Features", href: "/#features" },
    { name: "Why Us", href: "/#why" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-purple-900/20 border-b border-purple-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
              <SquareDashedMousePointer />
            </div>
            <span className="text-lg bg-linear-to-r text-blue-700 dark:text-blue-300 bg-clip-text font-extrabold">
              Flow
            </span>
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="text-sm text-slate-600 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative group"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Right side - Theme toggle & CTA */}
          <div className="flex items-center gap-4">
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

            <a href="/planner">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Get Started
              </motion.button>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
