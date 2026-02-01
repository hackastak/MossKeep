import Link from "next/link";
import {
  getDashboardStats,
  getOverdueTasks,
  getTasksDueToday,
  getUpcomingTasks,
  type TaskWithContact,
} from "./actions";
import { CompleteTaskButton } from "./complete-task-button";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = startOfToday.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function formatUpcomingDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
    </div>
  );
}

function TaskRow({
  task,
  dateDisplay,
  variant = "default",
}: {
  task: TaskWithContact;
  dateDisplay: string;
  variant?: "overdue" | "today" | "default";
}) {
  const contactName =
    task.contactFirstName && task.contactLastName
      ? `${task.contactFirstName} ${task.contactLastName}`
      : null;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-sm">
          {contactName && task.contactId ? (
            <Link
              href={`/contacts/${task.contactId}`}
              className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {contactName}
            </Link>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-500">No contact</span>
          )}
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span
            className={
              variant === "overdue"
                ? "text-red-600 dark:text-red-400"
                : variant === "today"
                ? "text-amber-600 dark:text-amber-400"
                : "text-zinc-500 dark:text-zinc-500"
            }
          >
            {dateDisplay}
          </span>
        </div>
      </div>
      <CompleteTaskButton taskId={task.id} />
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  variant,
  emptyMessage,
}: {
  title: string;
  tasks: TaskWithContact[];
  variant: "overdue" | "today" | "upcoming";
  emptyMessage?: string;
}) {
  const titleColorClass =
    variant === "overdue"
      ? "text-red-600 dark:text-red-400"
      : variant === "today"
      ? "text-amber-600 dark:text-amber-400"
      : "text-zinc-900 dark:text-zinc-100";

  if (variant === "overdue" && tasks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className={`mb-4 text-lg font-semibold ${titleColorClass}`}>
        {title} ({tasks.length})
      </h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-500">{emptyMessage}</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              dateDisplay={
                variant === "overdue" && task.dueDate
                  ? formatRelativeDate(task.dueDate)
                  : variant === "today"
                  ? "Due today"
                  : task.dueDate
                  ? formatUpcomingDate(task.dueDate)
                  : ""
              }
              variant={variant === "upcoming" ? "default" : variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, overdueTasks, todayTasks, upcomingTasks] = await Promise.all([
    getDashboardStats(),
    getOverdueTasks(),
    getTasksDueToday(),
    getUpcomingTasks(),
  ]);

  const hasNoTasks =
    overdueTasks.length === 0 &&
    todayTasks.length === 0 &&
    upcomingTasks.length === 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Welcome back
      </h1>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Contacts" value={stats.totalContacts} />
        <StatCard label="Active" value={stats.activeContacts} />
        <StatCard label="Tasks This Week" value={stats.tasksThisWeek} />
      </div>

      {/* Task Sections */}
      {hasNoTasks ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-center text-zinc-500 dark:text-zinc-500">
            No tasks yet. Tasks will appear here once you create them from contact
            pages.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <TaskSection
            title="Overdue"
            tasks={overdueTasks}
            variant="overdue"
          />
          <TaskSection
            title="Due Today"
            tasks={todayTasks}
            variant="today"
            emptyMessage="Nothing due today"
          />
          <TaskSection
            title="Upcoming - Next 7 Days"
            tasks={upcomingTasks}
            variant="upcoming"
            emptyMessage="No upcoming tasks this week"
          />
        </div>
      )}
    </div>
  );
}
