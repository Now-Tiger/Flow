"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section id="cta" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass-glow rounded-3xl p-12 sm:p-16 border border-blue-700/20 text-center relative"
        >
          {/* Animated background elements */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-px rounded-3xl bg-linear-to-r from-blue-600 to-blue-400 opacity-20 blur-2xl -z-10"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="text-white">Ready to Transform</span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Your Workflow?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white text-lg mb-8 max-w-2xl mx-auto"
          >
            Start turning your ideas into actionable tasks today. No credit card
            required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/planner">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(37, 99, 235, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 hover:shadow-glow transition-all duration-300 min-w-fit"
              >
                Launch TaskGenius
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <motion.a
              href="/planner"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass hover:glass-glow text-gray-200 font-semibold rounded-lg transition-all duration-300 cursor-pointer min-w-fit"
            >
              Request Demo
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
