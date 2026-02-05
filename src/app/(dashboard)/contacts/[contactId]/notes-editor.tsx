"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateContactNotes, type NotesFormState } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function NotesEditor({
  contactId,
  initialNotes,
}: {
  contactId: string;
  initialNotes: string | null;
}) {
  const updateNotesWithId = updateContactNotes.bind(null, contactId);
  const [state, formAction] = useActionState<NotesFormState, FormData>(
    updateNotesWithId,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.success && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Notes saved successfully.
          </p>
        </div>
      )}

      {state?.error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {state.error}
          </p>
        </div>
      )}

      <textarea
        name="notes"
        rows={6}
        defaultValue={initialNotes || ""}
        placeholder="Add notes about this contact..."
        className="block w-full rounded-md border-zinc-300 py-2 px-3 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 resize-none"
      />

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}
