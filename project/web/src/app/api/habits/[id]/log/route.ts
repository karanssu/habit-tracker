import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { toggleHabitToday } from "@/lib/habits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const result = await toggleHabitToday(userId, id);
  if (!result) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  return NextResponse.json(result);
}
