"use client";

import Link from "next/link";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Sparkles,
  User,
  ChevronUp,
  Loader,
  PackageOpen,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeTogger from "../components/ThemeTogger";
import { useRouter } from "next/navigation";

// --- Types ---
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type GenerateFormData = {
  featureGoal: string;
  targetUsers: string;
  constraints: string;
  templateType: string;
};

export default function FlowPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [projectGenerated, setProjectGenerated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<GenerateFormData>({
    featureGoal: "",
    targetUsers: "",
    constraints: "",
    templateType: "Web Application",
  });

  const templateOptions = [
    "Web Application",
    "Mobile Application",
    "Desktop Application",
    "Data Analysis",
    "API/Backend",
    "Machine Learning",
  ];

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useLayoutEffect(() => {
    if (mounted && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, mounted]);

  // Cleanup error timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof GenerateFormData,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.featureGoal.trim()) {
      return false;
    }
    if (!formData.targetUsers.trim()) {
      return false;
    }
    if (!formData.constraints.trim()) {
      return false;
    }
    return true;
  };

  const handleShowErrorModal = (): void => {
    setShowErrorModal(true);

    // Auto-redirect after 40 seconds
    errorTimeoutRef.current = setTimeout(() => {
      router.push("/workspace");
    }, 40000);
  };

  const handleGenerateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Add user's request message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Generate project breakdown:\n\nFeature Goal: ${formData.featureGoal}\nTarget Users: ${formData.targetUsers}\nConstraints: ${formData.constraints}\nTemplate: ${formData.templateType}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API to generate project with AI
      const response = await fetch("/api/workspace/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate project");
      }

      const data = await response.json();

      // Check if response data is empty or invalid
      if (
        !data ||
        !data.project ||
        !data.tasksCount ||
        data.tasksCount === 0 ||
        !data.project.id
      ) {
        // Invalid response - show error modal and don't create entry
        setMessages((prev) => prev.slice(0, -1)); // Remove the user message
        handleShowErrorModal();
        return;
      }

      // Add AI response message with project details
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've created a project breakdown for you!\n\n📋 Project: ${data.project.title}\n\n✅ Generated:\n- ${data.tasksCount} tasks total\n- ${data.userStoriesCount} user stories\n- ${data.engineeringTasksCount} engineering tasks\n- ${data.risksCount} risks/unknowns\n\nYou can now:\n1. View and edit these tasks\n2. Reorder and group them\n3. Export as text or markdown\n4. Save to your workspace\n\nProject ID: ${data.project.id}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Mark project as successfully generated
      setProjectGenerated(true);

      // Clear form after successful generation
      setFormData({
        featureGoal: "",
        targetUsers: "",
        constraints: "",
        templateType: "Web Application",
      });
      setInput("");
    } catch (error) {
      console.error("Error generating project:", error);

      // Remove user message and show error modal
      setMessages((prev) => prev.slice(0, -1));
      handleShowErrorModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call Claude API for chat
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Check if response data is empty
      if (!data || !data.response) {
        setMessages((prev) => prev.slice(0, -1)); // Remove user message
        handleShowErrorModal();
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove user message and show error modal
      setMessages((prev) => prev.slice(0, -1));
      handleShowErrorModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (messages.length === 0) {
        if (validateForm()) {
          handleGenerateProject(e);
        }
      } else {
        handleSendMessage(e);
      }
    }
  };

  if (!mounted) {
    return <div className="h-screen bg-white dark:bg-[#131314]" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-500/10 dark:to-slate-500/10">
      {/* --- Error Modal --- */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Internal Server Error
                </h2>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Something went wrong while generating your project. Please try
                again later.
              </p>

              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Redirecting to workspace in 40 seconds...
                </p>
                <Link href="/workspace">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (errorTimeoutRef.current) {
                        clearTimeout(errorTimeoutRef.current);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Go to Workspace Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Top Bar --- */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-transparent backdrop-blur-md border-b border-purple-500/20 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Link href={"/"}>
                  <Sparkles className="w-5 h-5 text-white" />
                </Link>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  Flow
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate project
                </p>
              </div>
            </div>

            {/* Right: Theme & Workspace */}
            <div className="flex items-center gap-4">
              {/* Theme toggler */}
              <ThemeTogger />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Link href={"/workspace"}>
                  <PackageOpen className="w-5 h-5" />
                </Link>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 scroll-smooth"
        style={{ paddingBottom: "max(400px, 35vh)" }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !projectGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 px-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 dark:text-gray-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
              >
                💡 Describe your feature goal in the chatbox below, then fill in
                the additional details to get started. I&apos;ll break down your
                idea into actionable tasks!
              </motion.div>
            </motion.div>
          )}

          {/* Display Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 w-full",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative px-5 py-3.5 max-w-2xl leading-relaxed text-[15px] rounded-2xl",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm",
                  )}
                >
                  <p className="whitespace-pre-wrap wrap-break-words">
                    {msg.content}
                  </p>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 w-full justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-5 py-3.5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* --- Sticky Chatbox with Integrated Form Fields (Hidden after project generation) --- */}
      <AnimatePresence>
        {!projectGenerated && (
          <motion.div
            ref={inputContainerRef}
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-white via-white/98 to-transparent dark:from-[#131314] dark:via-[#131314]/98 dark:to-transparent pt-8 pb-8 px-4 z-20"
          >
            <div className="max-w-3xl mx-auto">
              {/* Main Chatbox Card */}
              <motion.form
                layout
                onSubmit={
                  messages.length === 0
                    ? handleGenerateProject
                    : handleSendMessage
                }
                className="relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg overflow-visible "
              >
                {/* Additional Fields (Below chat input when no messages) */}
                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-3 space-y-3 dark:border-gray-700"
                    >
                      {/* Target Users Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                          Target Users *
                        </label>
                        <input
                          type="text"
                          value={formData.targetUsers}
                          onChange={(e) =>
                            handleFormInputChange(e, "targetUsers")
                          }
                          placeholder="e.g., SaaS customers, internal team members"
                          className="mt-1 w-full h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Constraints Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                          Constraints (Budget/Time) *
                        </label>
                        <input
                          type="text"
                          value={formData.constraints}
                          onChange={(e) =>
                            handleFormInputChange(e, "constraints")
                          }
                          placeholder="e.g., 2 weeks, $5k budget"
                          className="mt-1 w-full h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Template Type Dropdown - Opens Upwards */}
                      <div className="space-y-1.5 relative z-50">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                          Template Type
                        </label>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowTemplateDropdown(!showTemplateDropdown)
                            }
                            type="button"
                            className="mt-1 w-full h-11 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          >
                            <span>{formData.templateType}</span>
                            <ChevronUp
                              className={cn(
                                "w-4 h-10 transition-transform shrink-0",
                                showTemplateDropdown && "rotate-180",
                              )}
                            />
                          </button>

                          {/* Dropdown Menu - Opens Upwards */}
                          <AnimatePresence>
                            {showTemplateDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                              >
                                {templateOptions.map((option, index) => (
                                  <button
                                    key={option}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        templateType: option,
                                      }));
                                      setShowTemplateDropdown(false);
                                    }}
                                    type="button"
                                    className={cn(
                                      "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30",
                                      index !== templateOptions.length - 1 &&
                                        "border-b border-gray-200 dark:border-gray-700",
                                      formData.templateType === option
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-gray-700 dark:text-gray-300",
                                    )}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Chat Input Area */}
                <div className="px-4 py-3 flex items-end gap-2 bg-gray-50 dark:bg-gray-900/50">
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setFormData({
                        featureGoal: "",
                        targetUsers: "",
                        constraints: "",
                        templateType: "Web Application",
                      });
                      setInput("");
                      setShowTemplateDropdown(false);
                      setProjectGenerated(false);
                    }}
                    className="p-2.5 mb-5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300 shrink-0 hover:scale-110 active:scale-95"
                    title="New Project"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Update featureGoal as user types in main chat input
                      setFormData((prev) => ({
                        ...prev,
                        featureGoal: e.target.value,
                      }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      messages.length === 0
                        ? "Describe your feature goal... (e.g., Build a user authentication system)"
                        : "Ask me anything about your project..."
                    }
                    rows={1}
                    className="w-full h-15 bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-11 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base leading-tight"
                  />

                  <motion.button
                    type="submit"
                    disabled={
                      isLoading || (messages.length === 0 && !validateForm())
                    }
                    className={cn(
                      "p-2.5 mb-5 rounded-full transition-all shrink-0 flex items-center justify-center",
                      messages.length === 0 && !validateForm()
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95",
                      isLoading && "opacity-70 cursor-not-allowed",
                    )}
                    whileHover={
                      !isLoading &&
                      (messages.length === 0 ? validateForm() : true)
                        ? { scale: 1.1 }
                        : {}
                    }
                    whileTap={
                      !isLoading &&
                      (messages.length === 0 ? validateForm() : true)
                        ? { scale: 0.95 }
                        : {}
                    }
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 translate-x-0.5" />
                    )}
                  </motion.button>
                </div>
                {/* Footer Text */}
                <div className="px-4 py-2 "></div>
              </motion.form>
              <div className="mt-2">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center">
                  {messages.length === 0
                    ? "* Required fields • Fill feature goal and other fields to generate project"
                    : "AI can make mistakes, so double-check it."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
