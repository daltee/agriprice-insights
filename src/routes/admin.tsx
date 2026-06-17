import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — AgriPrice" }] }),
  component: Admin,
});

type Entry = {
  id: string;
  price: number;
  date_submitted: string;
  produce: { name: string } | null;
  market: { name: string } | null;
  profile: { name: string; email: string } | null;
};
type Profile = { id: string; name: string; email: string; role: string; created_at: string };

function Admin() {
  const role = useUserRole();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (role && role !== "admin") navigate({ to: "/dashboard" });
  }, [role, navigate]);

  const load = () => {
    supabase
      .from("price_entries")
      .select("id, price, date_submitted, produce:produce_id(name), market:market_id(name)")
      .order("date_submitted", { ascending: false })
      .limit(100)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => setEntries(((data as any) ?? []) as Entry[]));
    supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setUsers((data as Profile[]) ?? []));
  };
  useEffect(load, []);

  async function delEntry(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("price_entries").delete().eq("id", id);
    load();
  }

  if (role !== "admin") {
    return (
      <DashboardShell>
        <div className="p-10 text-muted-foreground">Checking admin access…</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl mb-2">Admin</h1>
          <p className="text-muted-foreground">Manage submitted entries and registered users.</p>
        </div>

        <section>
          <h2 className="text-xl mb-4">Recent entries</h2>
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Produce</th>
                  <th className="px-5 py-3 font-medium">Market</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">By</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-border hover:bg-green-soft transition-colors duration-150"
                  >
                    <td className="px-5 py-3 font-medium">{e.produce?.name}</td>
                    <td className="px-5 py-3">{e.market?.name}</td>
                    <td className="px-5 py-3 font-mono">UGX {Number(e.price).toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-foreground">—</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(e.date_submitted).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => delEntry(e.id)}
                        className="text-xs px-3 py-1.5 text-destructive border border-destructive/40 rounded hover:bg-destructive/10 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl mb-4">Users</h2>
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3 capitalize">
                      <span className="px-2 py-0.5 text-xs rounded bg-muted">{u.role}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
