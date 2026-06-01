-- Lock down trigger function: only the system needs it
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- has_role is used inside RLS policies; only signed-in users need it
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;