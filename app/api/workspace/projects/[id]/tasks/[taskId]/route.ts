// ============================================================================
// File: app/api/workspace/projects/[id]/tasks/[taskId]/route.ts
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase/server";

// API to  update individual tasks
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string, taskId: string }> }) {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, taskId } = await params
    const projectId = id;
    const taskID = taskId;
    const updates = await request.json()

    // Verify user owns this project
    const { data: project } = await supabaseClient
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update task
    const { data: updatedTask, error: updateError } = await supabaseClient
      .from('tasks')
      .update(updates)
      .eq('id', taskID)
      .eq('project_id', projectId)
      .select()

    if (updateError || !updatedTask || updatedTask.length === 0) {
      console.error('Task update error:', updateError)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    return NextResponse.json({ task: updatedTask[0] }, { status: 200 })
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
