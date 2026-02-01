"use server";

import { db } from "@/db";
import { contacts, loans, tasks, users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDemoContacts, getDemoLoans, getDemoTasks } from "./demo-data";

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new Error("Not authenticated");
  }

  // Get or create the database user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.userId, authUser.id))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Create user if doesn't exist
  const newUser = await db
    .insert(users)
    .values({
      userId: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.name || null,
    })
    .returning();

  return newUser[0];
}

export async function getDemoModeStatus(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user.demoModeEnabled;
  } catch {
    return false;
  }
}

export async function enableDemoMode(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();

    // Check if demo mode is already enabled
    if (user.demoModeEnabled) {
      return { success: true };
    }

    // Generate and insert demo contacts
    const demoContactsData = getDemoContacts(user.id);
    const contactMap = new Map<string, string>();

    for (const contactData of demoContactsData) {
      const { key, ...insertData } = contactData;
      const [insertedContact] = await db
        .insert(contacts)
        .values(insertData)
        .returning({ contactId: contacts.contactId });
      contactMap.set(key, insertedContact.contactId);
    }

    // Generate and insert demo loans
    const demoLoansData = getDemoLoans(user.id, contactMap);
    const loanMap = new Map<string, string>();

    for (const loanData of demoLoansData) {
      const { contactKey, ...insertData } = loanData;
      const [insertedLoan] = await db
        .insert(loans)
        .values(insertData)
        .returning({ id: loans.id });
      loanMap.set(contactKey, insertedLoan.id);
    }

    // Generate and insert demo tasks
    const demoTasksData = getDemoTasks(user.id, contactMap, loanMap);

    for (const taskData of demoTasksData) {
      await db.insert(tasks).values(taskData);
    }

    // Update user's demo mode status
    await db
      .update(users)
      .set({ demoModeEnabled: true })
      .where(eq(users.id, user.id));

    revalidatePath("/");
    revalidatePath("/contacts");

    return { success: true };
  } catch (error) {
    console.error("Error enabling demo mode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enable demo mode",
    };
  }
}

export async function disableDemoMode(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();

    // Check if demo mode is already disabled
    if (!user.demoModeEnabled) {
      return { success: true };
    }

    // Delete demo data in correct order (tasks -> loans -> contacts)
    // to respect foreign key constraints
    await db
      .delete(tasks)
      .where(and(eq(tasks.userId, user.id), eq(tasks.isDemo, true)));

    await db
      .delete(loans)
      .where(and(eq(loans.userId, user.id), eq(loans.isDemo, true)));

    await db
      .delete(contacts)
      .where(and(eq(contacts.userId, user.id), eq(contacts.isDemo, true)));

    // Update user's demo mode status
    await db
      .update(users)
      .set({ demoModeEnabled: false })
      .where(eq(users.id, user.id));

    revalidatePath("/");
    revalidatePath("/contacts");

    return { success: true };
  } catch (error) {
    console.error("Error disabling demo mode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to disable demo mode",
    };
  }
}

export async function toggleDemoMode(): Promise<{ success: boolean; enabled?: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();

    if (user.demoModeEnabled) {
      const result = await disableDemoMode();
      return { ...result, enabled: false };
    } else {
      const result = await enableDemoMode();
      return { ...result, enabled: true };
    }
  } catch (error) {
    console.error("Error toggling demo mode:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle demo mode",
    };
  }
}
