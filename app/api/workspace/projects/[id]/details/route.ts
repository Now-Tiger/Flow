// ============================================================================
// File: app/api/workspace/projects/[id]/details/route.ts
// ============================================================================
import { supabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { TaskGroup, Task } from "@/types/common";

// Get project details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Await the params before accessing properties
    const { id } = await params;
    const projectId = id;

    // Fetch project
    const { data: project, error: projectError } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch task groups
    const { data: taskGroups, error: groupsError } = await supabaseClient
      .from("task_groups")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });

    if (groupsError) {
      console.error("Error fetching task groups:", groupsError);
      return NextResponse.json( { error: "Failed to fetch task groups" }, { status: 500 });
    }

    // Fetch all tasks
    const { data: tasks, error: tasksError } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return NextResponse.json( { error: "Failed to fetch tasks" }, { status: 500 } );
    }

    // Group tasks by task_group_id
    const groupedTasks = (taskGroups || []).map((group: TaskGroup) => ({
      ...group,
      tasks: (tasks || []).filter(
        (task: Task) => task.task_group_id === group.id,
      ),
    }));

    return NextResponse.json(
      {
        project,
        taskGroups: groupedTasks,
        stats: {
          totalTasks: tasks?.length || 0,
          userStories:
            tasks?.filter((t: Task) => t.task_type === "user-story").length ||
            0,
          engineeringTasks:
            tasks?.filter((t: Task) => t.task_type === "engineering-task")
              .length || 0,
          risks:
            tasks?.filter(
              (t: Task) => t.task_type === "risk" || t.task_type === "unknown",
            ).length || 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get project details error:", error);
    return NextResponse.json( { error: "Internal server error" }, { status: 500 } );
  }
}
