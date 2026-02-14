"use client";

import { JSX, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Copy,
  Edit2,
  X,
  ChevronDown,
  Loader,
  CheckCircle,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  priority: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  estimated_hours?: number;
  task_status: string;
  display_order: number;
  task_group_id?: string;
}

interface TaskGroup {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  tasks: Task[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  target_users: string;
  constraints: string;
  template_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  totalTasks: number;
  userStories: number;
  engineeringTasks: number;
  risks: number;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/workspace/projects/${projectId}/details`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }

        const data = await response.json();
        setProject(data.project);
        setTaskGroups(data.taskGroups);
        setStats(data.stats);

        // Expand all groups by default
        const expanded: Record<string, boolean> = {};
        data.taskGroups.forEach((group: TaskGroup) => {
          expanded[group.id] = true;
        });
        setExpandedGroups(expanded);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  // Handle task reorder within group
  const handleTaskReorder = async (
    groupId: string,
    reorderedTasks: Task[],
  ): Promise<void> => {
    // Only allow reordering if there are multiple tasks in the group
    if (reorderedTasks.length <= 1) {
      return;
    }

    // Check if order actually changed
    const originalGroup = taskGroups.find((g) => g.id === groupId);
    if (
      !originalGroup ||
      JSON.stringify(originalGroup.tasks) === JSON.stringify(reorderedTasks)
    ) {
      return;
    }

    setIsReordering(true);

    // Update local state immediately for smooth UI
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, tasks: reorderedTasks } : group,
      ),
    );

    try {
      // Prepare tasks with updated display_order
      const tasksToUpdate = reorderedTasks.map((task, index) => ({
        id: task.id,
        display_order: index,
        task_group_id: groupId,
      }));

      // Call reorder API
      const response = await fetch(
        `/api/workspace/projects/${projectId}/tasks/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: tasksToUpdate }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reorder tasks");
      }

      setSuccessMessage("Tasks reordered successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error reordering tasks:", err);
      setError("Failed to reorder tasks");

      // Revert to previous state on error
      const fetchProjectDetails = async (): Promise<void> => {
        try {
          const response = await fetch(
            `/api/workspace/projects/${projectId}/details`,
          );
          if (response.ok) {
            const data = await response.json();
            setTaskGroups(data.taskGroups);
          }
        } catch (e) {
          console.error("Error refetching project:", e);
        }
      };
      fetchProjectDetails();
    } finally {
      setIsReordering(false);
      setDraggedTaskId(null);
    }
  };

  // Handle task update
  const handleTaskUpdate = async (task: Task): Promise<void> => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/workspace/projects/${projectId}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            difficulty: task.difficulty,
            task_status: task.task_status,
            estimated_hours: task.estimated_hours,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update local state
      setTaskGroups((prev) =>
        prev.map((group) => ({
          ...group,
          tasks: group.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
      );

      setSuccessMessage("Task updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle export
  const handleExport = async (format: "markdown" | "text"): Promise<void> => {
    try {
      const response = await fetch(
        `/api/workspace/projects/${projectId}/export?format=${format}`,
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.title}.${format === "markdown" ? "md" : "txt"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage(`Exported as ${format}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error exporting:", err);
      setError("Export failed");
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async (): Promise<void> => {
    try {
      const response = await fetch(
        `/api/workspace/projects/${projectId}/export?format=markdown`,
      );
      const content = await response.text();

      await navigator.clipboard.writeText(content);
      setSuccessMessage("Copied to clipboard");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error copying:", err);
      setError("Failed to copy to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white mb-4">
            {error || "Project not found"}
          </p>
          <Link href="/workspace">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Back to Workspace
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/workspace">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </Link>

              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {project.title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.template_type}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyToClipboard}
                className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </motion.button>

              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1"
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                {/* Export Dropdown */}
                <div className="absolute right-0 mt-0 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => handleExport("markdown")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-lg"
                  >
                    Export as Markdown
                  </button>
                  <button
                    onClick={() => handleExport("text")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 last:rounded-b-lg border-t border-gray-200 dark:border-slate-700"
                  >
                    Export as Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Banner - Center Top */}
      <AnimatePresence>
        {(successMessage || error) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 backdrop-blur-md border ${
                error
                  ? "bg-red-50/95 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                  : "bg-green-50/95 dark:bg-green-900/30 border-green-200 dark:border-green-800"
              }`}
            >
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  error
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}
              >
                {successMessage || error}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Project Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
              Total Tasks
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.totalTasks || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
              User Stories
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.userStories || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
              Tasks
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.engineeringTasks || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
              Risks
            </p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats?.risks || 0}
            </p>
          </div>
        </motion.div>

        {/* Project Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Feature Goal
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Target Users
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {project.target_users}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Constraints
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {project.constraints}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {project.status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Task Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {taskGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() =>
                  setExpandedGroups((prev) => ({
                    ...prev,
                    [group.id]: !prev[group.id],
                  }))
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {group.name} ({group.tasks.length})
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedGroups[group.id] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Group Tasks */}
              <AnimatePresence>
                {expandedGroups[group.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-slate-700 divide-y divide-gray-200 dark:divide-slate-700"
                  >
                    {group.tasks.length > 1 ? (
                      <Reorder.Group
                        axis="y"
                        values={group.tasks}
                        onReorder={(reorderedTasks: Task[]) =>
                          handleTaskReorder(group.id, reorderedTasks)
                        }
                      >
                        {group.tasks.map((task, index) => (
                          <Reorder.Item
                            key={task.id}
                            value={task}
                            onMouseDown={() => setDraggedTaskId(task.id)}
                            onMouseUp={() => setDraggedTaskId(null)}
                            onTouchStart={() => setDraggedTaskId(task.id)}
                            onTouchEnd={() => setDraggedTaskId(null)}
                          >
                            <motion.div
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-grab active:cursor-grabbing ${
                                draggedTaskId === task.id
                                  ? "bg-blue-50 dark:bg-blue-900/10"
                                  : ""
                              }`}
                            >
                              {editingTask?.id === task.id ? (
                                <TaskEditForm
                                  task={editingTask}
                                  setTask={setEditingTask}
                                  onSave={handleTaskUpdate}
                                  isSaving={isSaving}
                                  onCancel={() => setEditingTask(null)}
                                />
                              ) : (
                                <TaskCard
                                  task={task}
                                  onEdit={() => setEditingTask(task)}
                                  canReorder={true}
                                  isDragging={draggedTaskId === task.id}
                                />
                              )}
                            </motion.div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    ) : (
                      // Single task - no reorder ability
                      group.tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          {editingTask?.id === task.id ? (
                            <TaskEditForm
                              task={editingTask}
                              setTask={setEditingTask}
                              onSave={handleTaskUpdate}
                              isSaving={isSaving}
                              onCancel={() => setEditingTask(null)}
                            />
                          ) : (
                            <TaskCard
                              task={task}
                              onEdit={() => setEditingTask(task)}
                              canReorder={false}
                              isDragging={false}
                            />
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  onEdit,
  canReorder,
  isDragging,
}: {
  task: Task;
  onEdit: () => void;
  canReorder: boolean;
  isDragging: boolean;
}): JSX.Element {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300";
      default:
        return "";
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "hard":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "easy":
        return "text-green-600 dark:text-green-400";
      default:
        return "";
    }
  };

  return (
    <motion.div
      animate={{
        scale: isDragging ? 1.02 : 1,
        opacity: isDragging ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-3"
    >
      <div className="flex items-start justify-between gap-4">
        {canReorder && (
          <motion.div
            whileHover={{ scale: 1.2, color: "#2563eb" }}
            className="pt-1 flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors" />
          </motion.div>
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors shrink-0"
        >
          <Edit2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
        <span
          className={`text-xs font-medium ${getDifficultyColor(task.difficulty)}`}
        >
          {task.difficulty}
        </span>
        {task.estimated_hours && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.estimated_hours}h
          </span>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
          {task.task_status}
        </span>
      </div>
    </motion.div>
  );
}

// Task Edit Form Component
function TaskEditForm({
  task,
  setTask,
  onSave,
  isSaving,
  onCancel,
}: {
  task: Task;
  setTask: (task: Task) => void;
  onSave: (task: Task) => void;
  isSaving: boolean;
  onCancel: () => void;
}): JSX.Element {
  const handlePriorityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setTask({ ...task, priority: e.target.value as Task["priority"] });
  };

  const handleDifficultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setTask({ ...task, difficulty: e.target.value as Task["difficulty"] });
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setTask({ ...task, task_status: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg"
    >
      <div>
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
          Title
        </label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
          Description
        </label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Priority
          </label>
          <select
            value={task.priority}
            onChange={handlePriorityChange}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Difficulty
          </label>
          <select
            value={task.difficulty}
            onChange={handleDifficultyChange}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Status
          </label>
          <select
            value={task.task_status}
            onChange={handleStatusChange}
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(task)}
          disabled={isSaving}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : "Save"}
        </motion.button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
