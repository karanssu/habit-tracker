import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies(); // async in Next.js 15
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const userId = token ? verifyToken(token) : null;

  redirect(userId ? "/dashboard" : "/login");
}
