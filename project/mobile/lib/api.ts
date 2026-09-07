// EDIT THIS after you deploy the web app to Vercel:
// e.g. "https://habit-tracker-web.vercel.app"
// While developing, point it at your machine's LAN IP + port so a phone on
// the same wifi can reach `next dev`, e.g. "http://192.168.1.23:3000"
export const API_BASE_URL = "http://192.168.12.68:3000";

async function request(
	path: string,
	options: RequestInit = {},
	token?: string | null,
) {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	const body = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(body.error ?? `Request failed (${res.status})`);
	}
	return body;
}

export function login(email: string, password: string) {
	return request("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

export function register(email: string, password: string) {
	return request("/api/auth/register", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

export function getHabits(token: string) {
	return request("/api/habits", { method: "GET" }, token);
}

export function createHabit(token: string, name: string, emoji: string) {
	return request(
		"/api/habits",
		{ method: "POST", body: JSON.stringify({ name, emoji }) },
		token,
	);
}

export function toggleHabit(token: string, habitId: string) {
	return request(`/api/habits/${habitId}/log`, { method: "POST" }, token);
}

export function deleteHabit(token: string, habitId: string) {
	return request(`/api/habits/${habitId}`, { method: "DELETE" }, token);
}
