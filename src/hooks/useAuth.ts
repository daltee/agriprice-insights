import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "farmer" | "vendor" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const failSafe = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        if (cancelled) return;
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (cancelled) return;
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false);
        })
        .catch((error) => {
          if (cancelled) return;
          console.error(error);
          setLoading(false);
        });
      return () => {
        cancelled = true;
        window.clearTimeout(failSafe);
        sub.subscription.unsubscribe();
      };
    } catch (error) {
      console.error(error);
      setLoading(false);
      window.clearTimeout(failSafe);
      return;
    }
  }, []);

  return { session, user, loading };
}

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data?.some((r) => r.role === "admin")) setRole("admin");
        else if (data?.some((r) => r.role === "vendor")) setRole("vendor");
        else setRole("farmer");
      });
  }, [user]);
  return role;
}
