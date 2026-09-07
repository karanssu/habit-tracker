"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createHabitAction } from "@/app/dashboard/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {pending ? "Adding…" : "Add habit"}
    </button>
  );
}

export function NewHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabitAction(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2 rounded-lg bg-white p-4 shadow-sm"
    >
      <input
        name="emoji"
        defaultValue="✅"
        maxLength={2}
        className="w-12 rounded-md border border-slate-300 px-2 py-2 text-center"
      />
      <input
        name="name"
        required
        placeholder="New habit, e.g. Read 20 minutes"
        className="flex-1 rounded-md border border-slate-300 px-3 py-2"
      />
      <SubmitButton />
    </form>
  );
}
