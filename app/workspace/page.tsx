"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  LogOut,
  Folder,
  FileText,
  Clock,
  BarChart3,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  taskCount: number;
  task_groups: number;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data and projects
  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const userResponse = await fetch("/api/auth/me");
        if (!userResponse.ok) {
          router.push("/auth");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        // Get user's projects
        const projectsResponse = await fetch("/api/workspace/projects");
        const projectsData = await projectsResponse.json();

        if (projectsResponse.ok) {
          setProjects(projectsData.projects || []);
          setFilteredProjects(projectsData.projects || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load workspace data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndProjects();
  }, [router]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-700">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-transparent backdrop-blur-md border-b border-blue-300 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Flow
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Workspace
                </p>
              </div>
            </div>

            {/* Right: User & Logout */}
            <div className="flex items-center gap-4">
              {/* Theme toggler */}
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

              {user && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.first_name || user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.first_name || "there"}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your projects and tasks here. Start creating new specs to
            break down your ideas into actionable tasks.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="dark:bg-gray-900/50 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {projects.length}
                  </p>
                </div>
                <Folder className="w-10 h-10 text-blue-600/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-900/50 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {projects.reduce((sum, p) => sum + p.taskCount, 0)}
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-600/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-900/50 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recent Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {Math.min(
                      projects.filter((p) => {
                        const days =
                          (Date.now() - new Date(p.created_at).getTime()) /
                          (1000 * 60 * 60 * 24);
                        return days <= 7;
                      }).length,
                      9,
                    )}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-purple-600/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Create Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Create New Project Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/workspace/new">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredProjects.length === 0 ? (
            <Card className="dark:bg-gray-900/50 dark:border-gray-800">
              <CardContent className="pt-12 pb-12 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {projects.length === 0
                    ? "No projects yet"
                    : "No projects match your search"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {projects.length === 0
                    ? "Start creating your first project to break down ideas into tasks"
                    : "Try adjusting your search terms"}
                </p>
                {projects.length === 0 && (
                  <Link href="/workspace/new">
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                      <Plus className="w-5 h-5" />
                      Create Your First Project
                    </button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/workspace/${project.id}`}>
                    <Card className="h-full dark:bg-gray-900/50 dark:border-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {formatDate(project.created_at)}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-1 text-sm">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {project.taskCount}{" "}
                              {project.taskCount === 1 ? "task" : "tasks"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Folder className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {project.task_groups}{" "}
                              {project.task_groups === 1 ? "group" : "groups"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
