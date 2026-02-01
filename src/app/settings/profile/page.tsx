import { getUserProfile, updateUserProfile } from "./actions";

export default async function ProfilePage() {
  const user = await getUserProfile();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Profile Settings</h1>
      
      <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <form action={updateUserProfile} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user.email}
              disabled
              className="mt-1 block w-full rounded-md border-zinc-300 bg-zinc-100 py-2 px-3 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-zinc-500">Email cannot be changed.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user.name || ""}
              className="mt-1 block w-full rounded-md border-zinc-300 py-2 px-3 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
