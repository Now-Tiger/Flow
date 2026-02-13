// ============================================================================
// File: app/api/workspace/projects/route.ts
// ============================================================================
import { supabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// List projects of the logged user
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's projects with task and group counts
    const { data: projects, error } = await supabaseClient
      .from("projects")
      .select(
        `
        id,
        title,
        description,
        created_at,
        task_groups:task_groups(id),
        tasks:tasks(id)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 },
      );
    }
    // Format projects with counts
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      created_at: project.created_at,
      taskCount: project.tasks?.length || 0,
      task_groups: project.task_groups?.length || 0,
    }));

    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Create a project
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, targetUsers, constraints, templateType } =
      await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Create project
    const { data: project, error } = await supabaseClient
      .from("projects")
      .insert([
        {
          user_id: userId,
          title,
          description,
          target_users: targetUsers || "",
          constraints: constraints || "",
          template_type: templateType || "Web Application",
          status: "draft",
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 },
      );
    }

    return NextResponse.json({ project: project[0] }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
