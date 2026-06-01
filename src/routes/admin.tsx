import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Store,
  ClipboardList,
  Settings,
} from "lucide-react";
import { RequireAdmin } from "@/components/auth/Guards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — BiteBuddy" }] }),
  component: () => (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  ),
});

const TABS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/restaurants", label: "Restaurants", icon: Store },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Manage users, restaurants, menus and orders.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b pb-px">
        {TABS.map((t) => {
          const active = t.exact
            ? pathname === t.to
            : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="py-8">
        <Outlet />
      </div>
    </div>
  );
}
