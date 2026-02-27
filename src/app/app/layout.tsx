import Nav from "@/components/Nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container">
      <Nav />
      {children}
    </main>
  );
}
