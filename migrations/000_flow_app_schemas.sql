-- ============================================================================
-- TaskGenius Database Schema for Supabase PostgreSQL
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (Authentication & User Management)
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- 2. PROJECTS TABLE (Main TaskGenius Projects/Specs)
-- ============================================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL, -- Feature goal
  target_users TEXT NOT NULL,
  constraints TEXT NOT NULL, -- Budget/time constraints
  template_type VARCHAR(100) DEFAULT 'Web Application', -- web/mobile/internal
  status VARCHAR(50) DEFAULT 'draft', -- draft/generated/completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_user_created ON projects(user_id, created_at DESC);

-- ============================================================================
-- 3. TASK_GROUPS TABLE (For grouping tasks by type/milestone)
-- ============================================================================

CREATE TABLE task_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- "User Stories", "Engineering Tasks", "Risks", etc.
  description TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_groups_project_id ON task_groups(project_id);
CREATE INDEX idx_task_groups_order ON task_groups(project_id, display_order);

-- ============================================================================
-- 4. TASKS TABLE (Individual tasks/user stories)
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_group_id UUID REFERENCES task_groups(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  task_type VARCHAR(50) NOT NULL, -- user-story/engineering-task/risk/unknown
  priority VARCHAR(50) DEFAULT 'medium', -- low/medium/high
  difficulty VARCHAR(50) DEFAULT 'medium', -- easy/medium/hard
  estimated_hours INT,
  task_status VARCHAR(50) DEFAULT 'todo', -- todo/in-progress/done
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_group_id ON tasks(task_group_id);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_order ON tasks(project_id, display_order);

-- ============================================================================
-- 5. TASK_EDITS TABLE (Audit trail for task modifications)
-- ============================================================================

CREATE TABLE task_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  field_changed VARCHAR(100) NOT NULL, -- "title", "description", "priority", etc.
  original_value TEXT,
  new_value TEXT,
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_edits_task_id ON task_edits(task_id);
CREATE INDEX idx_task_edits_edited_at ON task_edits(edited_at DESC);

-- ============================================================================
-- COMMENTS & NOTES
-- ============================================================================

-- Users:
--   - Simple authentication: email + password_hash
--   - No complex auth required for MVP
--   - Password hashing should be done in backend (bcrypt recommended)

-- Projects:
--   - Linked to user_id for workspace isolation
--   - title: auto-generated from description (first 100 chars)
--   - status: tracks project lifecycle
--   - template_type: determines task generation approach
--   - ON DELETE CASCADE ensures projects deleted with user

-- Task Groups:
--   - Automatically created during task generation
--   - Groups tasks by type (User Stories, Engineering Tasks, Risks, Unknowns)
--   - display_order: for consistent ordering
--   - Can be custom (milestones, features, sprints)

-- Tasks:
--   - Core entity for all task/story items
--   - task_type determines categorization
--   - display_order: for drag-drop reordering
--   - All fields are updateable
--   - task_group_id is optional (can have ungrouped tasks)

-- Task Edits:
--   - Audit trail for compliance/history
--   - Tracks who changed what and when
--   - Can be used for undo functionality

-- Indexes:
--   - Optimized for common queries
--   - user_id lookups (most common)
--   - project creation date (for history feature)
--   - task ordering and filtering

-- Foreign Keys:
--   - All use ON DELETE CASCADE for data integrity
--   - Orphaned records automatically cleaned up
--   - Maintains referential integrity

-- ============================================================================
-- FUTURE ENHANCEMENTS (Not in MVP but planned)
-- ============================================================================

-- For authentication improvements:
-- ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
-- ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- For collaboration features:
-- CREATE TABLE project_shares (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
--   shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   permission VARCHAR(50) DEFAULT 'view', -- view/edit/admin
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- For comments/discussions:
-- CREATE TABLE task_comments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
--   user_id UUID REFERENCES users(id) ON DELETE SET NULL,
--   content TEXT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (OPTIONAL - For production)
-- ============================================================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE task_groups ENABLE ROW LEVEL SECURITY;

-- -- Users can only see their own data
-- CREATE POLICY "Users can view own data" ON users
--   FOR SELECT USING (auth.uid() = id);

-- -- Users can only see projects they own
-- CREATE POLICY "Users can view own projects" ON projects
--   FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
