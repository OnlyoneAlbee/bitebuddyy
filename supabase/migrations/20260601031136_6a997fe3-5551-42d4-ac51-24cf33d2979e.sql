-- ROLES ENUM
create type public.app_role as enum ('user', 'admin');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- HAS_ROLE FUNCTION
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- NEW USER TRIGGER
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RESTAURANTS
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.restaurants to authenticated;
grant select on public.restaurants to anon;
grant all on public.restaurants to service_role;
alter table public.restaurants enable row level security;

-- MENU ITEMS
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  image text,
  price numeric(10,2) not null default 0,
  category text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.menu_items to authenticated;
grant select on public.menu_items to anon;
grant all on public.menu_items to service_role;
alter table public.menu_items enable row level security;

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  total_amount numeric(10,2) not null default 0,
  delivery_address text,
  phone_number text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

-- ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0
);
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

-- USER_ROLES POLICIES
create policy "View own roles or admin views all"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Admins can grant roles"
  on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can revoke roles"
  on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- RESTAURANTS POLICIES
create policy "Anyone can view restaurants"
  on public.restaurants for select using (true);
create policy "Admins manage restaurants insert"
  on public.restaurants for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage restaurants update"
  on public.restaurants for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage restaurants delete"
  on public.restaurants for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- MENU ITEMS POLICIES
create policy "Anyone can view menu items"
  on public.menu_items for select using (true);
create policy "Admins manage menu insert"
  on public.menu_items for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage menu update"
  on public.menu_items for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage menu delete"
  on public.menu_items for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ORDERS POLICIES
create policy "Customers view own orders or admin all"
  on public.orders for select to authenticated
  using (auth.uid() = customer_id or public.has_role(auth.uid(), 'admin'));
create policy "Customers create own orders"
  on public.orders for insert to authenticated
  with check (auth.uid() = customer_id);
create policy "Admins update order status"
  on public.orders for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ORDER ITEMS POLICIES
create policy "View order items for accessible orders"
  on public.order_items for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  ));
create policy "Insert order items for own orders"
  on public.order_items for insert to authenticated
  with check (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.customer_id = auth.uid()
  ));

-- REALTIME
alter table public.orders replica identity full;
alter table public.order_items replica identity full;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;