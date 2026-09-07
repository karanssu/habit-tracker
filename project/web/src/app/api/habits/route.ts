import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserIdFromRequest } from "@/lib/auth";
import { getHabitsForUser, createHabit } from "@/lib/habits";

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const habits = await getHabitsForUser(userId);
  return NextResponse.json({ habits });
}

const createSchema = z.object({
  name: z.string().min(1).max(60),
  emoji: z.string().max(4).optional(),
});

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid habit" }, { status: 400 });
  }

  const habit = await createHabit(userId, parsed.data.name, parsed.data.emoji ?? "✅");
  return NextResponse.json({ habit }, { status: 201 });
}
