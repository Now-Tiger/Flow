"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function WorkspacePage() {
  const [formData, setFormData] = useState({
    featureGoal: "",
    targetUsers: "",
    constraints: "",
    templateType: "Web Application",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneratedResult(""); // Clear previous results

    try {
      // Construct a structured prompt from the form data
      const prompt = `
        Project Goal: ${formData.featureGoal}
        Target Users: ${formData.targetUsers}
        Constraints: ${formData.constraints}
        Template Type: ${formData.templateType}
        
        Please generate a comprehensive list of user stories and engineering tasks based on these requirements.
      `;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate tasks");
      }

      const data = await response.json();
      setGeneratedResult(data.text);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally handle UI error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 pt-24 pb-12 px-4">
      <Navbar />
      {/* Minimal Contained Glow Background */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-linear-to-r from-blue-600 to-blue-400 opacity-10 blur-2xl -z-10 pointer-events-none"
      />

      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        ></motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-2xl p-8 sm:p-10 border border-gray-200 dark:border-blue-500/20 shadow-lg dark:shadow-blue-500/5"
        >
          {/* Card Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Transform Your Idea Into Tasks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Describe your feature and let AI break it down into actionable
              user stories and engineering tasks.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feature Goal */}
            <div className="space-y-2">
              <label
                htmlFor="featureGoal"
                className="block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Feature Goal
              </label>
              <textarea
                id="featureGoal"
                name="featureGoal"
                value={formData.featureGoal}
                onChange={handleInputChange}
                placeholder="e.g., Build a user authentication system with email/password login"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={5}
              />
            </div>

            {/* Target Users */}
            <div className="space-y-2">
              <label
                htmlFor="targetUsers"
                className="block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Target Users
              </label>
              <input
                type="text"
                id="targetUsers"
                name="targetUsers"
                value={formData.targetUsers}
                onChange={handleInputChange}
                placeholder="e.g., SaaS customers, internal team members"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Constraints (Budget/Time) */}
            <div className="space-y-2">
              <label
                htmlFor="constraints"
                className="block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Constraints (Budget/Time)
              </label>
              <input
                type="text"
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleInputChange}
                placeholder="e.g., 2 weeks, $5k budget"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <label
                htmlFor="templateType"
                className="block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Template Type
              </label>
              <select
                id="templateType"
                name="templateType"
                value={formData.templateType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="API/Backend">API/Backend</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="DevOps/Infrastructure">
                  DevOps/Infrastructure
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              <Sparkles className="w-5 h-5" />
              {isSubmitting ? "Generating Tasks..." : "Generate Tasks"}
            </motion.button>
          </form>
        </motion.div>

        {/* Render Generated Response in Nice Comment Box */}
        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-8 glass rounded-2xl border border-gray-200 dark:border-blue-500/20 shadow-lg dark:shadow-blue-500/5 bg-white/50 dark:bg-slate-900/50"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Plan
              </h3>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-mono text-sm">
                {generatedResult}
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 p-6 glass rounded-xl border border-gray-200 dark:border-blue-500/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How it works
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                1.
              </span>
              <span>Describe your feature goal in detail</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                2.
              </span>
              <span>Specify your target users and constraints</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                3.
              </span>
              <span>Choose your project template type</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                4.
              </span>
              <span>AI generates structured tasks and milestones</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
