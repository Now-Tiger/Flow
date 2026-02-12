"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap, Eye, Users, Calendar, Moon } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    text: "Break down complex features in seconds",
  },
  {
    icon: Eye,
    text: "Visual risk assessment for every task",
  },
  {
    icon: Users,
    text: "Differentiate user stories from engineering tasks",
  },
  {
    icon: Calendar,
    text: "Organize with milestone buckets",
  },
  {
    icon: CheckCircle,
    text: "Track recent projects automatically",
  },
  {
    icon: Moon,
    text: "Beautiful dark and light modes",
  },
];

export function WhyTaskGenius() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="why" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="glow-text">Why </span>
              <span className="glow-text">Flow</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Stop wasting time breaking down features manually. Let AI do the
              heavy lifting while you focus on building.
            </p>

            {/* Benefits List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                      <div className="relative bg-gray-900 rounded-lg p-2">
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <span className="text-gray-500 dark:group-hover:text-gray-200 group-hover:text-gray-700 transition-colors">
                      {benefit.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="glass-glow rounded-3xl p-12 border border-purple-500/30 aspect-square flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Linear meets Notion
              </h3>
              <p className="text-gray-400 text-sm">
                Sleek, minimal, motion-rich
              </p>

              {/* Animated dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Glow effect overlay */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-purple-600/10 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
