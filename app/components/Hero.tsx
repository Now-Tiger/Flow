"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="floating-gradient" />

      {/* Minimal Contained Glow Background - Small Radius */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 w-100 h-100 rounded-full bg-linear-to-r from-blue-600 to-blue-400 opacity-15 blur-2xl -z-10 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="glass px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-Driven Planning Tool
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="block dark:text-white glass px-4 py-2 rounded-full text-gray-700">
            Turn Ideas Into
          </span>
          <span className="block bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500  bg-clip-text text-transparent">
            Actionable Tasks
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          A minimalist productivity tool for engineers and founders. Generate
          structured task breakdowns with AI, organize with drag-and-drop, and
          export instantly.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/planner">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(37, 99, 235, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 hover:shadow-glow transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          <motion.a
            href="#why"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass hover:glass-glow text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-300 cursor-pointer"
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Floating Cards Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative h-64 flex items-center justify-center"
        >
          {/* Card 1 */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-0 sm:left-12 glass-glow p-4 rounded-lg w-32 sm:w-40 text-left"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center mb-3">
              ✨
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              AI-Powered Generation
            </p>
          </motion.div>

          {/* Card 2 - Center */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.1 }}
            className="glass-glow p-4 rounded-lg w-32 sm:w-40 text-center mx-4"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Intuitive Workspace
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
            className="absolute right-0 sm:right-12 glass-glow p-4 rounded-lg w-32 sm:w-40 text-right"
          >
            <div className="text-2xl mb-2 flex justify-end">📤</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Export Anywhere
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
