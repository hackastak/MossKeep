"use server";

import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContactById(contactId: string) {
  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.contactId, contactId))
    .limit(1);
  return result[0] || null;
}

export async function createContact(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const address = formData.get("address") as string | null;
  const city = formData.get("city") as string | null;
  const state = formData.get("state") as string | null;
  const zipCode = formData.get("zipCode") as string | null;
  const status = formData.get("status") as string | null;

  if (!firstName || !lastName) {
    return { error: "First name and last name are required" };
  }

  await db.insert(contacts).values({
    firstName,
    lastName,
    email: email || null,
    phone: phone || null,
    address: address || null,
    city: city || null,
    state: state || null,
    zipCode: zipCode || null,
    status: status || "active",
  });

  revalidatePath("/contacts");
  return { success: true };
}

export async function updateContact(contactId: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const address = formData.get("address") as string | null;
  const city = formData.get("city") as string | null;
  const state = formData.get("state") as string | null;
  const zipCode = formData.get("zipCode") as string | null;
  const status = formData.get("status") as string | null;

  if (!firstName || !lastName) {
    return { error: "First name and last name are required" };
  }

  await db
    .update(contacts)
    .set({
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zipCode: zipCode || null,
      status: status || "active",
      updatedAt: new Date(),
    })
    .where(eq(contacts.contactId, contactId));

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${contactId}`);
  return { success: true };
}

export async function deleteContact(contactId: string) {
  await db.delete(contacts).where(eq(contacts.contactId, contactId));
  revalidatePath("/contacts");
  return { success: true };
}
