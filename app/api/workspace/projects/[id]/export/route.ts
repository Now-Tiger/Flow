// ============================================================================
// File: app/api/workspace/projects/[id]/export/route.ts
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase/server";
import { Task, TaskGroup, Project } from "@/types/common";

// For exporting project as text or markdown
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const projectId = id;
    const format = request.nextUrl.searchParams.get("format") || "markdown";

    // Fetch project
    const { data: project } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch task groups and tasks
    const { data: taskGroups } = await supabaseClient
      .from("task_groups")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });

    const { data: tasks } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });

    let content = "";
    let mimeType = "text/plain";
    let filename = `${project.title}.txt`;

    if (format === "markdown") {
      content = generateMarkdown(project, taskGroups || [], tasks || []);
      mimeType = "text/markdown";
      filename = `${project.title}.md`;
    } else {
      content = generatePlainText(project, taskGroups || [], tasks || []);
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

function generateMarkdown(project: Project, taskGroups: TaskGroup[], tasks: Task[]): string {
  let md = `# ${project.title}\n\n`;

  md += `**Feature Goal:** ${project.description}\n\n`;
  md += `**Target Users:** ${project.target_users}\n\n`;
  md += `**Constraints:** ${project.constraints}\n\n`;
  md += `**Template:** ${project.template_type}\n\n`;

  md += `---\n\n`;

  taskGroups.forEach((group: TaskGroup) => {
    const groupTasks = tasks.filter((t: Task) => t.task_group_id === group.id);

    if (groupTasks.length > 0) {
      md += `## ${group.name}\n\n`;

      groupTasks.forEach((task: Task) => {
        md += `### ${task.title}\n\n`;
        md += `${task.description}\n\n`;
        md += `- **Type:** ${task.task_type}\n`;
        md += `- **Priority:** ${task.priority}\n`;
        md += `- **Difficulty:** ${task.difficulty}\n`;
        if (task.estimated_hours) {
          md += `- **Estimated:** ${task.estimated_hours}h\n`;
        }
        md += `- **Status:** ${task.task_status}\n\n`;
      });
    }
  });

  return md;
}

function generatePlainText(project: Project, taskGroups: TaskGroup[], tasks: Task[]): string {
  let text = `${project.title}\n`;
  text += `${"=".repeat(project.title.length)}\n\n`;

  text += `Feature Goal: ${project.description}\n`;
  text += `Target Users: ${project.target_users}\n`;
  text += `Constraints: ${project.constraints}\n`;
  text += `Template: ${project.template_type}\n\n`;

  text += `${"=".repeat(80)}\n\n`;

  taskGroups.forEach((group: TaskGroup) => {
    const groupTasks = tasks.filter((t: Task) => t.task_group_id === group.id);

    if (groupTasks.length > 0) {
      text += `${group.name}\n`;
      text += `${"-".repeat(group.name.length)}\n\n`;

      groupTasks.forEach((task: Task, index: number) => {
        text += `${index + 1}. ${task.title}\n`;
        text += `   ${task.description}\n`;
        text += `   Type: ${task.task_type} | Priority: ${task.priority} | Difficulty: ${task.difficulty}\n`;
        if (task.estimated_hours) {
          text += `   Estimated: ${task.estimated_hours}h\n`;
        }
        text += `   Status: ${task.task_status}\n\n`;
      });
    }
  });

  return text;
}
