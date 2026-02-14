import { supabaseClient } from "@/lib/supabase/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  featureGoal: string;
  targetUsers: string;
  constraints: string;
  templateType: string;
}

interface GeneratedTask {
  title: string;
  description: string;
  type: "user-story" | "engineering-task" | "risk" | "unknown";
  priority: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  estimatedHours?: number;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateRequest = await request.json();
    const { featureGoal, targetUsers, constraints, templateType } = body;

    if (!featureGoal || !targetUsers || !constraints) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate project title
    const projectTitle = featureGoal.substring(0, 100).trim();

    // Prompt setup
    const prompt = `You are an expert task breakdown specialist. Given a feature idea, break it down into actionable items.

Feature Goal: ${featureGoal}
Target Users: ${targetUsers}
Constraints: ${constraints}
Template Type: ${templateType}

Generate a comprehensive breakdown with:
1. 3-4 user stories (from user perspective)
2. 5-7 engineering tasks (technical implementation)
3. 2-3 risks or unknowns

Return ONLY a valid JSON array (no markdown, no code blocks) with objects containing:
{
  "title": "string",
  "description": "string",
  "type": "user-story" | "engineering-task" | "risk" | "unknown",
  "priority": "low" | "medium" | "high",
  "difficulty": "easy" | "medium" | "hard",
  "estimatedHours": number (optional, for engineering tasks only)
}

Important:
- Return valid JSON array only, nothing else
- Start with [ and end with ]
- Make sure all strings are properly escaped
- Do not include any markdown or code block markers`;

    // Initialize the OpenRouter provider
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_KEY,
    });

    // 3. Call the AI model
    // We use a specific model optimized for instruction following.
    const { text } = await generateText({
      model: openrouter("nvidia/nemotron-3-nano-30b-a3b:free"),
      prompt: prompt,
    });

    let tasks: GeneratedTask[] = [];
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tasks = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", text);
      return NextResponse.json({ error: "Failed to parse task generation response" }, { status: 500 });
    }

    // Create project first
    const { data: project, error: projectError } = await supabaseClient
      .from("projects")
      .insert([
        {
          user_id: userId,
          title: projectTitle,
          description: featureGoal,
          target_users: targetUsers,
          constraints: constraints,
          template_type: templateType || "Web Application",
          status: "draft",
        },
      ])
      .select();

    if (projectError || !project || project.length === 0) {
      console.error("Project creation error:", projectError);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 },
      );
    }

    const projectId = project[0].id;

    // Create task groups based on type
    const groupsByType: Record<string, string> = {};
    let groupOrder = 0;

    const taskTypes = ["user-story", "engineering-task", "risk", "unknown"];
    const groupNames: Record<string, string> = {
      "user-story": "User Stories",
      "engineering-task": "Engineering Tasks",
      risk: "Risks",
      unknown: "Unknowns",
    };

    // Create groups for types that have tasks
    for (const type of taskTypes) {
      if (tasks.some((t) => t.type === type)) {
        const { data: group, error: groupError } = await supabaseClient
          .from("task_groups")
          .insert([
            {
              project_id: projectId,
              name: groupNames[type],
              display_order: groupOrder++,
            },
          ])
          .select();

        if (!groupError && group && group.length > 0) {
          groupsByType[type] = group[0].id;
        }
      }
    }

    // Insert tasks
    let taskOrder = 0;
    const { error: tasksError } = await supabaseClient.from("tasks").insert(
      tasks.map((task) => ({
        project_id: projectId,
        task_group_id: groupsByType[task.type] || null,
        title: task.title,
        description: task.description,
        task_type: task.type,
        priority: task.priority,
        difficulty: task.difficulty,
        estimated_hours: task.estimatedHours || null,
        task_status: "todo",
        display_order: taskOrder++,
      })),
    );

    if (tasksError) {
      console.error("Tasks creation error:", tasksError);
      return NextResponse.json(
        { error: "Failed to create tasks" },
        { status: 500 },
      );
    }

    // Count tasks by type
    const userStoriesCount = tasks.filter(
      (t) => t.type === "user-story",
    ).length;
    const engineeringTasksCount = tasks.filter(
      (t) => t.type === "engineering-task",
    ).length;
    const risksCount = tasks.filter(
      (t) => t.type === "risk" || t.type === "unknown",
    ).length;

    return NextResponse.json(
      {
        project: project[0],
        tasksCount: tasks.length,
        userStoriesCount,
        engineeringTasksCount,
        risksCount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Generate project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
