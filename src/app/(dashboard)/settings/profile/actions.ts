"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new Error("Not authenticated");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.userId, authUser.id))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

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

export type ProfileFormState = {
  success?: boolean;
  error?: string;
} | null;

export async function updateUserProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;

  try {
    await db
      .update(users)
      .set({ name })
      .where(eq(users.userId, authUser.id));

    revalidatePath("/settings/profile");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}
