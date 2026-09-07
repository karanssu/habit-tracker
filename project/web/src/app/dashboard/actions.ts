"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";
import * as habits from "@/lib/habits";

async function requireUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = token ? verifyToken(token) : null;
  if (!userId) redirect("/login");
  return userId;
}

export async function createHabitAction(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "✅").trim();
  if (!name) return;

  await habits.createHabit(userId, name, emoji);
  revalidatePath("/dashboard");
}

export async function toggleHabitAction(habitId: string) {
  const userId = await requireUserId();
  await habits.toggleHabitToday(userId, habitId);
  revalidatePath("/dashboard");
}

export async function deleteHabitAction(habitId: string) {
  const userId = await requireUserId();
  await habits.deleteHabit(userId, habitId);
  revalidatePath("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
