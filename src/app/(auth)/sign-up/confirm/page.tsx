import Link from "next/link";

export default function ConfirmPage() {
  return (
    <div className="text-center">
      <div className="mb-4 text-5xl">📧</div>
      <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Check your email
      </h2>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        We&apos;ve sent you a confirmation link. Please check your email and
        click the link to verify your account.
      </p>
      <Link
        href="/sign-in"
        className="inline-block rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
