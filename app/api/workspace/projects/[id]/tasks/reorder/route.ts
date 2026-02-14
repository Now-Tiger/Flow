// ============================================================================
// File: app/api/workspace/projects/[id]/tasks/reorder/route.ts
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase/server";
import { Task } from "@/types/common"

// For reordering and grouping tasks

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const projectId = id;
    const { tasks: tasksUpdates } = await request.json()

    if (!Array.isArray(tasksUpdates)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Verify user owns this project
    const { data: project } = await supabaseClient
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update all tasks with new orders and groups
    const updatePromises = tasksUpdates.map((update: Task) =>
      supabaseClient
        .from('tasks')
        .update({
          display_order: update.display_order,
          task_group_id: update.task_group_id,
        })
        .eq('id', update.id)
        .eq('project_id', projectId)
    )

    await Promise.all(updatePromises)

    // Fetch updated tasks
    const { data: updatedTasks } = await supabaseClient
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true })

    return NextResponse.json({ tasks: updatedTasks }, { status: 200 })
  } catch (error) {
    console.error('Reorder tasks error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
