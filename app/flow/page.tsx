"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Image as ImageIcon,
  Mic,
  Moon,
  Sun,
  Sparkles,
  User,
  House,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Types ---
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// --- Dummy Data ---
const DUMMY_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you explain the theory of relativity in simple terms?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Imagine space as a giant rubber sheet. If you place a heavy bowling ball (like the Sun) in the center, it curves the sheet. If you roll a marble (like Earth) nearby, it will follow that curve. That curve is gravity! \n\nEssentially, massive objects warp space and time around them, and this warping dictates how other objects move.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    role: "user",
    content: "That makes sense. What about time dilation?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Time dilation basically means that time moves slower as you move faster, or as you get closer to a massive source of gravity. \n\nIf you were an astronaut traveling near the speed of light, you might age only one year while everyone on Earth ages ten years!",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
];

export default function GeminiChatPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a separate effect for scrolling that depends on messages
  // This avoids the 'cascading render' warning by separating hydration logic from UI logic
  useLayoutEffect(() => {
    if (mounted && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, mounted]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Prevent hydration mismatch by returning a placeholder or null
  if (!mounted) {
    return <div className="h-screen bg-white dark:bg-[#131314]" />;
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#131314] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      {/* --- Top Bar --- */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"></div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href={"/"}>
              <House className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
          </button>
        </div>
      </header>

      {/* --- Main Chat Area --- */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-48 pt-4 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-10">
          {messages.length === 0 && (
            <div className="mt-20 px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-semibold bg-linear-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-fit mb-2"
              >
                Hello, Human.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-gray-400 font-medium"
              >
                How can I help you today?
              </motion.p>
            </div>
          )}

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
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-red-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative px-5 py-3.5 max-w-[85%] leading-relaxed text-[15px]",
                    msg.role === "user"
                      ? "bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-3xl rounded-tr-sm text-gray-800 dark:text-gray-100 shadow-sm"
                      : "text-gray-800 dark:text-gray-100",
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Sticky Footer / Input Area --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-white via-white/95 to-transparent dark:from-[#131314] dark:via-[#131314]/95 dark:to-transparent pt-12 pb-8 px-4 z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            layout
            className="relative bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[2rem] px-4 py-3 flex items-end gap-2 shadow-md border border-transparent focus-within:border-gray-200 dark:focus-within:border-gray-700 transition-all"
          >
            <button className="p-2.5 rounded-full bg-gray-200 dark:bg-[#2c2d2e] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300 shrink-0 mb-0.5">
              <Plus className="w-5 h-5" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini"
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-11 py-2.5 text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base leading-tight"
            />

            <div className="flex items-center gap-1 mb-0.5 shrink-0">
              <AnimatePresence initial={false} mode="wait">
                {input.length === 0 ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1"
                  >
                    <button className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#333537] text-gray-600 dark:text-gray-400 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#333537] text-gray-600 dark:text-gray-400 transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="send"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={handleSend}
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"
                  >
                    <Send className="w-4 h-4 translate-x-0.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="text-center mt-3">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              Gemini can make mistakes, so double-check it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
