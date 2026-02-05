"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfile, type ProfileFormState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export function ProfileForm({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    updateUserProfile,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.success && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Profile updated successfully.
          </p>
        </div>
      )}

      {state?.error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {state.error}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={email}
          disabled
          className="mt-1 block w-full rounded-md border-zinc-300 bg-zinc-100 py-2 px-3 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-zinc-500">Email cannot be changed.</p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={name || ""}
          className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
