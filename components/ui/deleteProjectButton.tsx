'use client'

import { JSX, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertCircle, Loader } from 'lucide-react'

interface DeleteProjectButtonProps {
  projectId: string
  projectTitle: string
  onDelete: (projectId: string) => Promise<void>
  isLoading: boolean
}

function shortProjectTitle(projectTitle: string): string {
  // 1. Basic validation for empty strings
  if (!projectTitle || projectTitle.trim().length === 0) {
    return projectTitle;
  }

  // 2. Split the title by spaces to get individual words
  const words = projectTitle.trim().split(/\s+/);

  // 3. Logic: If title has more than 5 words, take the first 5 and add "...."
  if (words.length > 8) {
    return words.slice(0, 8).join(" ") + " ....";
  }

  // 4. Return original if it's 5 words or fewer
  return projectTitle;
}

export function DeleteProjectButton({ projectId, projectTitle, onDelete, isLoading }: DeleteProjectButtonProps): JSX.Element {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await onDelete(projectId)
      setShowConfirm(false)
    } catch (error) {
      console.error('Error deleting project:', error)
      setShowConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowConfirm(true)}
        disabled={isLoading || isDeleting}
        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
        title="Delete project"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            // Updated animation to slide UP (y: 10 -> y: 0)
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            // 1. 'bottom-full': Positions the bottom of dialog at top of parent
            // 2. 'mb-2': Adds space between button and dialog
            // 3. 'origin-bottom-right': animation expands from the button corner
            className="absolute -right-9 bottom-full mb-2 origin-bottom-right bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg shadow-xl p-4 w-64 z-50"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  Delete {shortProjectTitle(projectTitle)}?
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
