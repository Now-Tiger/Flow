/**
 * Common Type Aliases for code clarity
 */
export type UUID = string;
export type ISOString = string; // e.g. "2023-10-27T10:00:00Z"

/**
 * ============================================================================
 * ENUMS & CONSTANTS
 * Defined as Union Types for better TS interoperability
 * ============================================================================
 */

export type ProjectTemplateType =
  | "Web Application"
  | "Mobile Application"
  | "Internal Tool"
  | string; // Allow custom strings if needed

export type ProjectStatus = "draft" | "generated" | "completed";

export type TaskType = "user-story" | "engineering-task" | "risk" | "unknown";

export type TaskPriority = "low" | "medium" | "high";

export type TaskDifficulty = "easy" | "medium" | "hard";

export type TaskStatus = "todo" | "in-progress" | "done";

/**
 * ============================================================================
 * DATABASE ENTITIES
 * These match your Supabase tables 1:1
 * ============================================================================
 */

// 1. USERS TABLE
export interface UserInfo {
  id: UUID;
  email: string;
  // NOTE: password_hash is omitted from the frontend interface for security
  // password_hash: string;
  first_name: string | null;
  last_name: string | null;
  created_at: ISOString;
  updated_at: ISOString;
}

// 2. PROJECTS TABLE
export interface Project {
  id: UUID;
  user_id: UUID;
  title: string;
  description: string;
  target_users: string;
  constraints: string;
  template_type: ProjectTemplateType;
  status: ProjectStatus;
  created_at: ISOString;
  updated_at: ISOString;
}

// 3. TASK_GROUPS TABLE
export interface TaskGroup {
  id: UUID;
  project_id: UUID;
  name: string;
  description: string | null;
  display_order: number;
  created_at: ISOString;
  updated_at: ISOString;
}

// 4. TASKS TABLE
export interface Task {
  id: UUID;
  project_id: UUID;
  task_group_id: UUID | null; // Nullable as per schema
  title: string;
  description: string;
  task_type: TaskType;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  estimated_hours: number | null;
  task_status: TaskStatus;
  display_order: number;
  created_at: ISOString;
  updated_at: ISOString;
}

// 5. TASK_EDITS TABLE
export interface TaskEdit {
  id: UUID;
  task_id: UUID;
  field_changed: keyof Task | string; // Helper to strictly type known fields
  original_value: string | null;
  new_value: string | null;
  edited_at: ISOString;
}

/**
 * ============================================================================
 * COMPOSITE TYPES (OPTIONAL)
 * Helpful for fetching data with relationships (e.g. Supabase joins)
 * ============================================================================
 */

// Useful when fetching a Project with all its related data for the "Board" view
export interface ProjectDetail extends Project {
  task_groups: TaskGroup[];
  tasks: Task[];
}

// Useful if you are grouping tasks under their groups in the UI
export interface TaskGroupWithTasks extends TaskGroup {
  tasks: Task[];
}
