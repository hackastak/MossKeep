import Link from "next/link";
import { notFound } from "next/navigation";
import { getContactById } from "../actions";
import { getLoansByContactId, getTasksByContactId } from "./actions";
import { CreateTaskModal } from "./create-task-modal";
import { NotesEditor } from "./notes-editor";
import { TaskActions } from "./task-actions";

function formatCurrency(amount: string | null): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(amount));
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getTaskStatus(
  task: { dueDate: Date | null; completedAt: Date | null }
): "completed" | "overdue" | "pending" {
  if (task.completedAt) return "completed";
  if (task.dueDate) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (new Date(task.dueDate) < startOfToday) return "overdue";
  }
  return "pending";
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;

  const [contact, loans, tasks] = await Promise.all([
    getContactById(contactId),
    getLoansByContactId(contactId),
    getTasksByContactId(contactId),
  ]);

  if (!contact) {
    notFound();
  }

  const fullAddress = [contact.address, contact.city, contact.state, contact.zipCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/contacts"
          className="flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contacts
        </Link>
        <Link
          href={`/contacts/${contactId}/edit`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
        >
          Edit Contact
        </Link>
      </div>

      {/* Contact Info Card */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {contact.firstName} {contact.lastName}
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</p>
            <p className="text-zinc-900 dark:text-zinc-100">{contact.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
            <p className="text-zinc-900 dark:text-zinc-100">{contact.phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</p>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                contact.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {contact.status || "active"}
            </span>
          </div>
        </div>

        {fullAddress && (
          <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Address</p>
            <p className="text-zinc-900 dark:text-zinc-100">{fullAddress}</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Notes
        </h2>
        <NotesEditor contactId={contactId} initialNotes={contact.notes} />
      </div>

      {/* Loans Table */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Loans ({loans.length})
        </h2>

        {loans.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No loans for this contact.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(loan.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {loan.loanType || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          loan.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {loan.status || "-"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(loan.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tasks Table */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Tasks ({tasks.length})
          </h2>
          <CreateTaskModal contactId={contactId} />
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No tasks yet. Create your first task to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Due Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tasks.map((task) => {
                  const status = getTaskStatus(task);
                  const isCompleted = status === "completed";

                  return (
                    <tr key={task.id}>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
                          isCompleted
                            ? "text-zinc-400 line-through dark:text-zinc-500"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {task.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {task.dueDate ? formatDate(task.dueDate) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : status === "overdue"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {status === "completed"
                            ? "Completed"
                            : status === "overdue"
                            ? "Overdue"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                        <TaskActions
                          taskId={task.id}
                          contactId={contactId}
                          isCompleted={isCompleted}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
