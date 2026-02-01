"use server";

import { db } from "@/db";
import { contacts, loans, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLoansByContactId(contactId: string) {
  const result = await db
    .select()
    .from(loans)
    .where(eq(loans.contactId, contactId))
    .orderBy(loans.createdAt);

  return result;
}

export async function getTasksByContactId(contactId: string) {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.contactId, contactId))
    .orderBy(tasks.dueDate);

  return result;
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const dueDate = formData.get("dueDate") as string | null;
  const contactId = formData.get("contactId") as string;

  if (!title) {
    return { error: "Title is required" };
  }

  if (!contactId) {
    return { error: "Contact ID is required" };
  }

  await db.insert(tasks).values({
    title,
    description: description || null,
    dueDate: dueDate ? new Date(dueDate) : null,
    contactId,
    status: "pending",
  });

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
  return { success: true };
}

export async function completeTask(taskId: string, contactId: string) {
  await db
    .update(tasks)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteTask(taskId: string, contactId: string) {
  await db.delete(tasks).where(eq(tasks.id, taskId));

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
  return { success: true };
}
