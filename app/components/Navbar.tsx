"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ThemeTogger from "./ThemeTogger";

export default function Navbar() {
  const navItems = [
    { name: "Home", href: "/" },
    // { name: "App", href: "/flow" },
    { name: "Features", href: "/#features" },
    { name: "Why Us", href: "/#why" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-transparent border-b border-purple-500/20"
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
            <div className="p-2 bg-blue-600 rounded-lg ">
              <Sparkles className="w-5 h-5 text-white" />
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
            <ThemeTogger />

            <a href="/auth">
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
