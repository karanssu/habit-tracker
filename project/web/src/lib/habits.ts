import { prisma } from "@/lib/db";

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getHabitsForUser(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      logs: {
        orderBy: { date: "desc" },
        take: 60, // enough history to compute a meaningful streak
      },
    },
  });

  return habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    emoji: habit.emoji,
    doneToday: habit.logs.some(
      (log) => log.date.getTime() === startOfTodayUTC().getTime()
    ),
    streak: calculateStreak(habit.logs.map((l) => l.date)),
  }));
}

export function calculateStreak(logDates: Date[]): number {
  const days = new Set(logDates.map((d) => d.getTime()));
  let streak = 0;
  const cursor = startOfTodayUTC();

  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function createHabit(userId: string, name: string, emoji: string) {
  return prisma.habit.create({
    data: { userId, name, emoji: emoji || "✅" },
  });
}

export async function deleteHabit(userId: string, habitId: string) {
  // scoped to userId so one user can never delete another user's habit
  await prisma.habit.deleteMany({ where: { id: habitId, userId } });
}

/** Flips today's completion state for a habit and returns the new state. */
export async function toggleHabitToday(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return null;

  const today = startOfTodayUTC();
  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: today } },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({ data: { habitId, date: today } });
  }

  const logs = await prisma.habitLog.findMany({
    where: { habitId },
    orderBy: { date: "desc" },
    take: 60,
  });

  return {
    doneToday: !existing,
    streak: calculateStreak(logs.map((l) => l.date)),
  };
}
