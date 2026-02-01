"use server";

import { db } from "@/db";
import { contacts, tasks } from "@/db/schema";
import { and, count, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  const thirtyDaysAgo = new Date(startOfToday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalContactsResult, activeContactsResult, tasksThisWeekResult, contactsLast30DaysResult] =
    await Promise.all([
      db.select({ count: count() }).from(contacts),
      db
        .select({ count: count() })
        .from(contacts)
        .where(eq(contacts.status, "active")),
      db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            gte(tasks.dueDate, startOfToday),
            lt(tasks.dueDate, endOfWeek),
            isNull(tasks.completedAt)
          )
        ),
      db
        .select({ count: count() })
        .from(contacts)
        .where(gte(contacts.createdAt, thirtyDaysAgo)),
    ]);

  return {
    totalContacts: totalContactsResult[0]?.count ?? 0,
    activeContacts: activeContactsResult[0]?.count ?? 0,
    tasksThisWeek: tasksThisWeekResult[0]?.count ?? 0,
    contactsLast30Days: contactsLast30DaysResult[0]?.count ?? 0,
  };
}

export type TaskWithContact = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: string | null;
  contactId: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
};

export async function getOverdueTasks(limit = 5): Promise<TaskWithContact[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const result = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      status: tasks.status,
      contactId: tasks.contactId,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
    })
    .from(tasks)
    .leftJoin(contacts, eq(tasks.contactId, contacts.contactId))
    .where(and(lt(tasks.dueDate, startOfToday), isNull(tasks.completedAt)))
    .orderBy(tasks.dueDate)
    .limit(limit);

  return result;
}

export async function getTasksDueToday(limit = 5): Promise<TaskWithContact[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const result = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      status: tasks.status,
      contactId: tasks.contactId,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
    })
    .from(tasks)
    .leftJoin(contacts, eq(tasks.contactId, contacts.contactId))
    .where(
      and(
        gte(tasks.dueDate, startOfToday),
        lt(tasks.dueDate, startOfTomorrow),
        isNull(tasks.completedAt)
      )
    )
    .orderBy(tasks.dueDate)
    .limit(limit);

  return result;
}

export async function getUpcomingTasks(limit = 5): Promise<TaskWithContact[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const result = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      dueDate: tasks.dueDate,
      status: tasks.status,
      contactId: tasks.contactId,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
    })
    .from(tasks)
    .leftJoin(contacts, eq(tasks.contactId, contacts.contactId))
    .where(
      and(
        gte(tasks.dueDate, startOfTomorrow),
        lt(tasks.dueDate, endOfWeek),
        isNull(tasks.completedAt)
      )
    )
    .orderBy(tasks.dueDate)
    .limit(limit);

  return result;
}

export async function completeTask(taskId: string) {
  await db
    .update(tasks)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  revalidatePath("/");
  return { success: true };
}
