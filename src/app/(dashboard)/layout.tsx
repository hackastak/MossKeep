import { Navbar } from "@/components/navbar";
import { getDemoModeStatus } from "./demo-mode/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoModeEnabled = await getDemoModeStatus();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar demoModeEnabled={demoModeEnabled} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
