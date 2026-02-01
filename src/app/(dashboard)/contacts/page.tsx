import Link from "next/link";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc, asc, ilike, eq, or, and, SQL } from "drizzle-orm";
import { DeleteContactButton } from "./delete-button";

type SortField = "name" | "email" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

interface ContactsPageProps {
  searchParams: Promise<{
    sort?: SortField;
    order?: SortOrder;
    search?: string;
    status?: string;
  }>;
}

async function getContacts(
  sortField: SortField = "createdAt",
  sortOrder: SortOrder = "desc",
  search?: string,
  statusFilter?: string
) {
  const orderFn = sortOrder === "asc" ? asc : desc;

  let orderBy;
  switch (sortField) {
    case "name":
      orderBy = orderFn(contacts.firstName);
      break;
    case "email":
      orderBy = orderFn(contacts.email);
      break;
    case "status":
      orderBy = orderFn(contacts.status);
      break;
    case "createdAt":
    default:
      orderBy = orderFn(contacts.createdAt);
      break;
  }

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(
      or(
        ilike(contacts.firstName, `%${search}%`),
        ilike(contacts.lastName, `%${search}%`),
        ilike(contacts.email, `%${search}%`)
      )!
    );
  }

  if (statusFilter && statusFilter !== "all") {
    conditions.push(eq(contacts.status, statusFilter));
  }

  const baseQuery = db.select().from(contacts).$dynamic();

  if (conditions.length > 0) {
    const whereClause = conditions.length === 1
      ? conditions[0]
      : and(...conditions);
    return await baseQuery.where(whereClause).orderBy(orderBy);
  }

  return await baseQuery.orderBy(orderBy);
}

function SortableHeader({
  field,
  currentSort,
  currentOrder,
  search,
  status,
  children,
}: {
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  search?: string;
  status?: string;
  children: React.ReactNode;
}) {
  const isActive = currentSort === field;
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";

  const params = new URLSearchParams();
  params.set("sort", field);
  params.set("order", nextOrder);
  if (search) params.set("search", search);
  if (status) params.set("status", status);

  return (
    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      <Link
        href={`/contacts?${params.toString()}`}
        className="group inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        {children}
        <span className={isActive ? "text-zinc-900 dark:text-zinc-100" : "opacity-0 group-hover:opacity-50"}>
          {isActive && currentOrder === "asc" ? "\u2191" : "\u2193"}
        </span>
      </Link>
    </th>
  );
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const sort = (params.sort as SortField) || "createdAt";
  const order = (params.order as SortOrder) || "desc";
  const search = params.search || "";
  const status = params.status || "all";

  const allContacts = await getContacts(sort, order, search, status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Contacts
        </h1>
        <Link
          href="/contacts/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
        >
          Create Contact
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <form className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              name="search"
              placeholder="Search contacts..."
              defaultValue={search}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pl-9 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            name="status"
            defaultValue={status}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="order" value={order} />
          <button
            type="submit"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Filter
          </button>
          {(search || status !== "all") && (
            <Link
              href="/contacts"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <SortableHeader
                field="name"
                currentSort={sort}
                currentOrder={order}
                search={search}
                status={status}
              >
                Name
              </SortableHeader>
              <SortableHeader
                field="email"
                currentSort={sort}
                currentOrder={order}
                search={search}
                status={status}
              >
                Email
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Phone
              </th>
              <SortableHeader
                field="status"
                currentSort={sort}
                currentOrder={order}
                search={search}
                status={status}
              >
                Status
              </SortableHeader>
              <SortableHeader
                field="createdAt"
                currentSort={sort}
                currentOrder={order}
                search={search}
                status={status}
              >
                Created
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {allContacts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  {search || status !== "all"
                    ? "No contacts match your filters."
                    : "No contacts yet. Create your first contact to get started."}
                </td>
              </tr>
            ) : (
              allContacts.map((contact) => (
                <tr
                  key={contact.contactId}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/contacts/${contact.contactId}`}
                      className="text-zinc-900 hover:text-zinc-600 hover:underline dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {contact.email || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {contact.phone || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        contact.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {contact.status || "active"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/contacts/${contact.contactId}/edit`}
                        className="rounded px-2 py-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        Edit
                      </Link>
                      <DeleteContactButton contactId={contact.contactId} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
