import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";
import { getHabitsForUser } from "@/lib/habits";
import { HabitCard } from "@/components/HabitCard";
import { NewHabitForm } from "@/components/NewHabitForm";
import { logoutAction } from "@/app/dashboard/actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = token ? verifyToken(token) : null;
  if (!userId) redirect("/login");

  const habits = await getHabitsForUser(userId);

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your habits</h1>
        <form action={logoutAction}>
          <button className="text-sm text-slate-500 underline">Log out</button>
        </form>
      </div>

      <div className="mb-6">
        <NewHabitForm />
      </div>

      {habits.length === 0 ? (
        <p className="text-slate-500">No habits yet — add your first one above.</p>
      ) : (
        <ul className="space-y-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </ul>
      )}
    </main>
  );
}
