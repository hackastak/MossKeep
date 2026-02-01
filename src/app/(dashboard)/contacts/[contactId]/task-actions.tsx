"use client";

import { useState } from "react";
import { completeTask, deleteTask } from "./actions";

interface TaskActionsProps {
  taskId: string;
  contactId: string;
  isCompleted: boolean;
}

export function TaskActions({ taskId, contactId, isCompleted }: TaskActionsProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleComplete() {
    setIsCompleting(true);
    await completeTask(taskId, contactId);
    setIsCompleting(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    await deleteTask(taskId, contactId);
    setIsDeleting(false);
  }

  return (
    <div className="flex items-center gap-1">
      {!isCompleted && (
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
          title="Mark as complete"
        >
          {isCompleting ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        title="Delete task"
      >
        {isDeleting ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    </div>
  );
}
