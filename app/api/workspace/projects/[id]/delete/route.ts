// ============================================================================
// File: app/api/workspace/projects/[id]/delete/route.ts
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase/server";

/**
 * DELETE /api/workspace/projects/[id]/delete
 *
 * Deletes a project and all related data (tasks, task_groups, task_edits)
 * Only the project owner can delete their project
 *
 * Benefits of using CASCADE on DELETE:
 * - task_edits are deleted when tasks are deleted (ON DELETE CASCADE on task_id)
 * - tasks are deleted when task_groups are deleted (ON DELETE CASCADE on task_group_id)
 * - task_groups are deleted when project is deleted (ON DELETE CASCADE on project_id)
 * - All cleanup happens automatically at database level
 *
 * Response:
 * - 200: Project successfully deleted
 * - 401: Unauthorized (not authenticated)
 * - 403: Forbidden (not project owner)
 * - 404: Project not found
 * - 500: Server error
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    // Get user ID from cookie
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const projectId = id;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // 1. Verify project exists and user owns it
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('id, user_id, title')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 2. Verify user owns this project
    if (project.user_id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - you can only delete your own projects' },
        { status: 403 }
      )
    }

    // 3. Delete the project
    // Due to CASCADE constraints in the database, this will automatically delete:
    // - All task_groups associated with this project
    // - All tasks associated with this project
    // - All task_edits associated with those tasks
    const { error: deleteError } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting project:', deleteError)
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: `Project "${project.title}" and all related data has been deleted`,
        projectId: projectId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// Alternative implementation with manual cleanup (for reference)
// Use this if your database doesn't have CASCADE constraints
// ============================================================================

/**
 * Manual cleanup version - DELETE with explicit deletion of related records
 * 
 * This version manually deletes related records in the correct order:
 * 1. task_edits (depends on tasks)
 * 2. tasks (depends on task_groups and projects)
 * 3. task_groups (depends on projects)
 * 4. projects
 *
 * Uncomment below code if you need manual cleanup instead of CASCADE
 */

/*
export async function DELETE_MANUAL(
  request: NextRequest,
  { params }: DeleteParams
): Promise<NextResponse> {
  try {
    const userId = request.cookies.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Verify project exists and user owns it
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, title')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get all task_group ids for this project
    const { data: taskGroups } = await supabase
      .from('task_groups')
      .select('id')
      .eq('project_id', projectId)

    // Get all task ids for this project
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('project_id', projectId)

    // 1. Delete task_edits for all tasks in this project
    if (tasks && tasks.length > 0) {
      const taskIds = tasks.map((t: { id: string }) => t.id)
      await supabase.from('task_edits').delete().in('task_id', taskIds)
    }

    // 2. Delete all tasks for this project
    await supabase.from('tasks').delete().eq('project_id', projectId)

    // 3. Delete all task_groups for this project
    await supabase.from('task_groups').delete().eq('project_id', projectId)

    // 4. Delete the project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting project:', deleteError)
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: `Project "${project.title}" and all related data has been deleted`,
        projectId: projectId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
