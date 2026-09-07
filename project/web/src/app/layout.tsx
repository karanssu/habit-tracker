import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Habit Tracker",
	description: "A small habit tracker to relearn Next.js with.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen">{children}</body>
		</html>
	);
}
