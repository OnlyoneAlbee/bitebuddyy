import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Loader2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/auth/Guards";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNaira, formatDate, initials } from "@/utils/format";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — BiteBuddy" }] }),
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

const statusColor: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground",
  preparing: "bg-primary/15 text-primary",
  delivered: "bg-success/15 text-success",
};

function ProfilePage() {
  const { user, profile, isAdmin } = useAuth();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("profile-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarFallback className="bg-hero-gradient text-lg font-bold text-primary-foreground">
            {initials(profile?.full_name, profile?.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-extrabold">
            {profile?.full_name || "Your profile"}
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <Badge className="mt-1" variant={isAdmin ? "default" : "secondary"}>
            {isAdmin ? "Admin" : "Customer"}
          </Badge>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">My orders</h2>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          <Package className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-3">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">
                  Order #{o.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(o.created_at)} · {o.delivery_address}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">
                  {formatNaira(Number(o.total_amount))}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusColor[o.status] ?? "bg-muted"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
