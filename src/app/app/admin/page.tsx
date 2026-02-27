import { createClient } from "@/lib/supabase/server";
import AdminClient from "./adminClient";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");

  const { data: me } = await supabase.from("profiles").select("role,email,full_name").eq("user_id", u.user.id).single();
  if (me?.role !== "admin") {
    return (
      <div className="card">
        <h1 className="h1">Admin</h1>
        <p>Kein Zugriff.</p>
      </div>
    );
  }

  const { data: users } = await supabase.from("profiles").select("user_id,email,full_name,role,created_at").order("created_at", { ascending: false });
  return <AdminClient users={(users ?? []) as any[]} />;
}
