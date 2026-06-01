import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Store, Users, ClipboardList, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RequireAdmin } from "@/components/auth/Guards";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — BiteBuddy" }] }),
  component: () => (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  ),
});

interface UserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  isAdmin: boolean;
}

function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ restaurants: 0, users: 0, orders: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [restaurantsRes, ordersRes, profilesRes, rolesRes] = await Promise.all([
      supabase.from("restaurants").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id, full_name, email"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const adminIds = new Set(
      (rolesRes.data ?? [])
        .filter((r) => r.role === "admin")
        .map((r) => r.user_id),
    );

    const profiles = profilesRes.data ?? [];
    setUsers(
      profiles.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        isAdmin: adminIds.has(p.id),
      })),
    );

    setStats({
      restaurants: restaurantsRes.count ?? 0,
      users: profiles.length,
      orders: ordersRes.count ?? 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAdmin = async (target: UserRow) => {
    setUpdatingId(target.id);
    try {
      if (target.isAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", target.id)
          .eq("role", "admin");
        if (error) throw error;
        toast.success(`Removed admin from ${target.full_name ?? target.email}`);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: target.id, role: "admin" });
        if (error) throw error;
        toast.success(`${target.full_name ?? target.email} is now an admin`);
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === target.id ? { ...u, isAdmin: !u.isAdmin } : u,
        ),
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update admin role",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const cards = [
    { label: "Restaurants", value: stats.restaurants, icon: Store },
    { label: "Registered Users", value: stats.users, icon: Users },
    { label: "Total Orders", value: stats.orders, icon: ClipboardList },
  ];

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Overview of the platform and user management.
      </p>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {cards.map((c) => (
              <Card key={c.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </CardTitle>
                  <c.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">{c.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          {u.full_name ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {u.email ?? "—"}
                        </TableCell>
                        <TableCell>
                          {u.isAdmin ? (
                            <Badge>Admin</Badge>
                          ) : (
                            <Badge variant="secondary">User</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.id === user?.id ? (
                            <span className="text-xs text-muted-foreground">
                              You
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant={u.isAdmin ? "outline" : "default"}
                              disabled={updatingId === u.id}
                              onClick={() => toggleAdmin(u)}
                            >
                              {updatingId === u.id && (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              )}
                              {u.isAdmin ? "Remove admin" : "Make admin"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
