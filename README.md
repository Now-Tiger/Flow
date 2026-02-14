# Flow 🚀

**AI-powered task planning tool that transforms your feature ideas into actionable project breakdowns in seconds.**

Flow is like having an expert project manager in your pocket. Simply describe your feature goal, and let Claude AI instantly generate organized user stories, engineering tasks, and risks. Edit, reorder, group, and export your tasks seamlessly.

---

## 📋 Table of Contents

- [What is Flow?](#what-is-taskgenius)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

---

## What is Flow?

Flow is a modern web application that leverages AI to help product teams and developers break down feature ideas into structured, manageable tasks. Instead of spending hours planning, you can now:

1. **Describe your vision** - Write your feature goal in plain English
2. **Get instant breakdown** - Claude AI generates user stories, engineering tasks, and risks
3. **Organize & refine** - Edit, reorder, and group tasks to match your workflow
4. **Export & share** - Download as Markdown or plain text for easy sharing

Perfect for startup founders, product managers, and development teams who want to ship faster.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Git**
- Accounts for:
  - [Supabase](https://supabase.com) (PostgreSQL database)
  - [openrouter api](https://openrouter.ai) (AI model access)

### Quick Start

Get Flow running locally in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/Now-Tiger/Flow.git
cd Flow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local

# 4. Configure your secrets in .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
# OPENROUTER_KEY=your_anthropic_key

# 5. Create database tables
# Run SQL from supabase_schema.sql in your Supabase dashboard

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000 in your browser
```

---

## Installation

### Detailed Setup Instructions

#### Step 1: Clone Repository

```bash
git clone https://github.com/Now-Tiger/Flow.git
cd Flow
```

#### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

#### Step 3: Setup Supabase Database

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy and run the schema from `supabase_schema.sql`
5. Get your credentials:
   - URL: Settings > API > Project URL
   - Service Role Key: Settings > API > Project API Keys

#### Step 4: Setup Openrouter API KEY

1. Create account at [openrouter.ai](https://openrouter.ai)
2. Generate API key from your account dashboard
3. Note the key for environment setup

#### Step 5: Configure Environment

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Anthropic
OPENROUTER_KEY=sk-ant-your-key-here

# Next.js
NODE_ENV=development
```

#### Step 6: Run Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Workflow Overview

#### 1. Sign Up / Login

- Visit the landing page
- Create account with email and password
- Login to access your workspace

#### 2. Create New Project

- Click "New Project" from workspace
- Describe your feature goal
- Specify target users
- Add constraints (budget/time)
- Select project template
- Click "Generate"

#### 3. AI Task Generation

- Claude AI analyzes your requirements
- Generates user stories, engineering tasks, and risks
- Tasks are automatically organized by type
- All data saved to your workspace

#### 4. Manage Tasks

- **Edit Tasks:** Click edit button, modify details, save
- **Reorder Tasks:** Drag tasks within groups to reorder
- **Group Tasks:** Automatically grouped by type
- **Track Progress:** Update task status (Todo/In Progress/Done)

#### 5. Export & Share

- **Copy to Clipboard:** One-click copy of project
- **Export Markdown:** Download as `.md` file
- **Export Text:** Download as `.txt` file
- Share with team members easily

### Example Project

**Goal:** "Build a real-time chat application"
**Target Users:** "Mobile users, team collaboration"
**Constraints:** "4 weeks, $15k budget"
**Template:** "Mobile Application"

Output:

- 3 User Stories (Authentication, Chat, Notifications)
- 7 Engineering Tasks (Backend, Frontend, Database, API)
- 2 Risks (Real-time sync complexity, Performance at scale)

---

## Features

### Core Features

✨ **AI-Powered Task Generation**

- Instant breakdown of feature ideas into actionable tasks
- Uses Claude 3.5 Sonnet for intelligent analysis
- Context-aware suggestions based on template type

🎯 **Smart Task Management**

- Edit task details (title, description, priority, difficulty)
- Drag-and-drop reordering within task groups
- Automatic task grouping by type (User Stories, Engineering Tasks, Risks)
- Track task status (Todo, In Progress, Done)
- Estimated hours for engineering tasks

📊 **Project Dashboard**

- View all generated projects
- Quick statistics (total tasks, user stories, engineering tasks, risks)
- Search and filter projects
- Project metadata (goal, users, constraints, template)

💾 **Export & Sharing**

- Export as Markdown format
- Export as plain text format
- Copy project to clipboard
- Share with team members

🔐 **Authentication & Security**

- Email/password authentication
- Secure session management with httpOnly cookies
- User workspace isolation
- Role-based access control

🎨 **Modern UI/UX**

- Clean, minimal design with glass-glow effects
- IBM Blue color scheme
- Full dark mode support
- Responsive design (mobile to desktop)
- Smooth animations with Framer Motion

⚡ **Real-time Notifications**

- Floating notification banners for success/error
- Center-top positioning for visibility
- Auto-dismiss after 3 seconds
- Spring physics animations

🌐 **Multi-format Support**

- 6 project templates (Web, Mobile, Desktop, Data Analysis, API, ML)
- Flexible constraint specification
- Support for various team sizes

---

## Tech Stack

### Frontend

- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Components:** shadcn/ui
- **State Management:** React Hooks

### Backend

- **Runtime:** Node.js
- **API:** Next.js App Router
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Supabase JavaScript Client
- **Authentication:** Cookie-based sessions
- **Password Hashing:** bcryptjs

### AI

- **Model:** Claude 3.5 Sonnet (Anthropic)
- **Integration:** Anthropic JavaScript SDK

### DevOps

- **Deployment:** Vercel (recommended)
- **Database:** Supabase Hosting
- **Version Control:** Git

---

## Project Structure

```
Flow/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       └── page.tsx                 # Login/Signup
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── workspace/
│   │   │   ├── projects/route.ts
│   │   │   ├── generate/route.ts
│   │   │   └── [id]/
│   │   │       ├── details/route.ts
│   │   │       ├── export/route.ts
│   │   │       └── tasks/
│   │   │           ├── [taskId]/route.ts
│   │   │           └── reorder/route.ts
│   │   └── chat/message/route.ts
│   ├── flow/
│   │   └── page.tsx                     # Project Generator
│   ├── workspace/
│   │   ├── page.tsx                     # Projects Dashboard
│   │   └── [id]/
│   │       └── page.tsx                 # Project Details
│   ├── layout.tsx
│   └── page.tsx                         # Landing Page
├── components/
│   ├── ThemeTogger.tsx
│   └── ...
├── lib/
│   └── utils.ts
├── middleware.ts
├── .env.local                           # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Purpose                 |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Create new user account |
| POST   | `/api/auth/login`  | User login              |
| POST   | `/api/auth/logout` | User logout             |
| GET    | `/api/auth/me`     | Get current user        |

### Projects

| Method | Endpoint                                      | Purpose                  |
| ------ | --------------------------------------------- | ------------------------ |
| GET    | `/api/workspace/projects`                     | List user's projects     |
| POST   | `/api/workspace/projects`                     | Create new project       |
| POST   | `/api/workspace/generate`                     | Generate project with AI |
| GET    | `/api/workspace/projects/[id]/details`        | Get project details      |
| PUT    | `/api/workspace/projects/[id]/tasks/[taskId]` | Update task              |
| PATCH  | `/api/workspace/projects/[id]/tasks/reorder`  | Reorder tasks            |
| GET    | `/api/workspace/projects/[id]/export`         | Export project           |

### Chat

| Method | Endpoint            | Purpose            |
| ------ | ------------------- | ------------------ |
| POST   | `/api/chat/message` | Send message to AI |

---

## Configuration

### Environment Variables

```env
# Supabase PostgreSQL Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic Claude API
OPENROUTER_KEY=sk-ant-v0-...

# Node Environment
NODE_ENV=development
```

---

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Support

- 📧 Email: <swapnil.narwade3@gmail.com>
- 🐛 Issues: [GitHub Issues](https://github.com/Now-Tiger/Flow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Now-Tiger/Flow/discussions)

---

## Roadmap

### Coming Soon

- [ ] Drag-drop bulk task management
- [ ] Project collaboration & sharing
- [ ] Task comments & discussions
- [ ] Advanced filtering & search
- [ ] Custom templates
- [ ] Team workspaces
- [ ] Integration with Jira & Linear
- [ ] Mobile app
- [ ] AI chat refinement for tasks
- [ ] Undo/redo functionality

---

## Acknowledgments

- **Language Model** - Gemini language model from openrouter
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Supabase** - Open source Firebase alternative

---

**Built with ❤️ for teams who ship fast**

Flow © 2024. All rights reserved.
