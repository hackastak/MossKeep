"use server";

import { db } from "@/db";
import { contacts } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getContacts() {
  const allContacts = await db.select().from(contacts).orderBy(contacts.createdAt);
  return allContacts;
}

export async function createContact(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const status = formData.get("status") as string | null;

  if (!firstName || !lastName) {
    return { error: "First name and last name are required" };
  }

  await db.insert(contacts).values({
    firstName,
    lastName,
    email: email || null,
    phone: phone || null,
    status: status || "active",
  });

  revalidatePath("/contacts");
  return { success: true };
}
