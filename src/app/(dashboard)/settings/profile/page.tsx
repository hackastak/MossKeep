import { getUserProfile } from "./actions";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await getUserProfile();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <ProfileForm email={user.email} name={user.name} />
      </div>
    </div>
  );
}
