import { toggleHabitAction, deleteHabitAction } from "@/app/dashboard/actions";

type Habit = {
  id: string;
  name: string;
  emoji: string;
  doneToday: boolean;
  streak: number;
};

export function HabitCard({ habit }: { habit: Habit }) {
  const toggle = toggleHabitAction.bind(null, habit.id);
  const remove = deleteHabitAction.bind(null, habit.id);

  return (
    <li className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{habit.emoji}</span>
        <div>
          <p className="font-medium">{habit.name}</p>
          <p className="text-sm text-slate-500">
            {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : "No streak yet"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <form action={toggle}>
          <button
            type="submit"
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              habit.doneToday
                ? "bg-green-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {habit.doneToday ? "Done today" : "Mark done"}
          </button>
        </form>
        <form action={remove}>
          <button type="submit" className="text-sm text-slate-400 hover:text-red-500">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}
