"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Grid3x3, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description:
      "Transform feature ideas into structured tasks instantly with intelligent analysis",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    icon: Grid3x3,
    title: "Intuitive Workspace",
    description:
      "Drag, drop, and organize tasks into milestones with a smooth, motion-rich interface",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    icon: CheckCircle2,
    title: "Export Anywhere",
    description:
      "Download your task breakdown as Markdown or plain text for seamless integration",
    gradient: "from-emerald-400 to-emerald-600",
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="glow-text">Everything You Need</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Built for productivity, designed for elegance
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)",
                }}
                className="group relative"
              >
                {/* Card Background */}
                <div className="glass-glow rounded-2xl p-8 h-full border border-purple-500/30 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-lg bg-linear-to-br ${feature.gradient} p-3 mb-6 flex items-center justify-center text-white`}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold dark:text-white text-gray-700 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
