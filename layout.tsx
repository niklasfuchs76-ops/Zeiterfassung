import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zeitstempel",
  description: "Ein-/Ausstempeln + automatische Plus/Minus Stunden",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
