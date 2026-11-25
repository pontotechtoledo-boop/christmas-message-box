
create type public.app_role as enum ('admin','customer');
create type public.product_status as enum ('draft','published','inactive');
create type public.order_status as enum ('pending','paid','failed','canceled','refunded');
create type public.discount_type as enum ('percent','fixed');

-- roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_adult boolean not null default false,
  is_kids boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public active categories" on public.categories for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin categories write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null default 0 check (price >= 0),
  promo_price numeric(10,2) check (promo_price is null or promo_price >= 0),
  short_description text not null default '',
  description text not null default '',
  details text[] not null default '{}',
  usage_instructions text,
  format text not null default 'PDF',
  image_url text,
  gallery text[] not null default '{}',
  video_url text,
  file_path text,
  status product_status not null default 'draft',
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_on_sale boolean not null default false,
  show_on_home boolean not null default false,
  is_adult boolean not null default false,
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public published products" on public.products for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "admin products write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
-- hide private file path from public: revoke column
revoke select (file_path) on public.products from anon;

-- recommendations
create table public.product_recommendations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  recommended_id uuid not null references public.products(id) on delete cascade,
  kind text not null default 'related' check (kind in ('related','complementary','bundle')),
  priority int not null default 0,
  is_active boolean not null default true,
  unique (product_id, recommended_id)
);
grant select on public.product_recommendations to anon, authenticated;
grant insert, update, delete on public.product_recommendations to authenticated;
grant all on public.product_recommendations to service_role;
alter table public.product_recommendations enable row level security;
create policy "public recs" on public.product_recommendations for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin recs" on public.product_recommendations for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- coupons
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type discount_type not null,
  discount_value numeric(10,2) not null check (discount_value > 0),
  minimum_order numeric(10,2) not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions int,
  per_customer_limit int,
  redemption_count int not null default 0,
  product_ids uuid[] not null default '{}',
  category_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "admin coupons" on public.coupons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- campaigns (surprise gift)
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  headline text not null default 'Você ganhou um presente!',
  message text not null default '',
  coupon_id uuid references public.coupons(id) on delete set null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.campaigns to authenticated;
grant all on public.campaigns to service_role;
alter table public.campaigns enable row level security;
create policy "admin campaigns" on public.campaigns for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- combos
create table public.combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_ids uuid[] not null,
  combo_price numeric(10,2) not null check (combo_price >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions int,
  redemption_count int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.combos to anon, authenticated;
grant insert, update, delete on public.combos to authenticated;
grant all on public.combos to service_role;
alter table public.combos enable row level security;
create policy "public combos" on public.combos for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin combos" on public.combos for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- progressive tiers
create table public.discount_tiers (
  id uuid primary key default gen_random_uuid(),
  min_subtotal numeric(10,2) not null check (min_subtotal > 0),
  discount_type discount_type not null,
  discount_value numeric(10,2) not null check (discount_value > 0),
  label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.discount_tiers to anon, authenticated;
grant insert, update, delete on public.discount_tiers to authenticated;
grant all on public.discount_tiers to service_role;
alter table public.discount_tiers enable row level security;
create policy "public tiers" on public.discount_tiers for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin tiers" on public.discount_tiers for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- banners
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  description text,
  image_url text,
  button_label text,
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  priority int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy "public banners" on public.banners for select to anon, authenticated using ((is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())) or public.has_role(auth.uid(),'admin'));
create policy "admin banners" on public.banners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  customer_name text,
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  discount_total numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_id uuid references public.coupons(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  discount_breakdown jsonb not null default '[]',
  stripe_session_id text unique,
  stripe_payment_intent text,
  environment text not null default 'sandbox',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "own orders" on public.orders for select to authenticated using (user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt()->>'email','')) or public.has_role(auth.uid(),'admin'));
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  combo_id uuid references public.combos(id) on delete set null
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "own order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or lower(o.email) = lower(coalesce(auth.jwt()->>'email','')) or public.has_role(auth.uid(),'admin'))));

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null default 'stripe',
  provider_ref text,
  amount numeric(10,2) not null,
  status text not null,
  raw jsonb,
  created_at timestamptz not null default now()
);
grant select on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "admin payments" on public.payments for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.webhook_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);
grant all on public.webhook_events to service_role;
alter table public.webhook_events enable row level security;

create table public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade unique,
  email text not null,
  created_at timestamptz not null default now()
);
grant select on public.coupon_redemptions to authenticated;
grant all on public.coupon_redemptions to service_role;
alter table public.coupon_redemptions enable row level security;
create policy "admin redemptions" on public.coupon_redemptions for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  user_id uuid,
  email text,
  created_at timestamptz not null default now()
);
grant select on public.downloads to authenticated;
grant all on public.downloads to service_role;
alter table public.downloads enable row level security;
create policy "own downloads" on public.downloads for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.store_settings (
  key text primary key,
  value jsonb not null default '{}',
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select on public.store_settings to anon, authenticated;
grant insert, update, delete on public.store_settings to authenticated;
grant all on public.store_settings to service_role;
alter table public.store_settings enable row level security;
create policy "public settings" on public.store_settings for select to anon, authenticated using (is_public or public.has_role(auth.uid(),'admin'));
create policy "admin settings" on public.store_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.admin_audit_log to authenticated;
grant all on public.admin_audit_log to service_role;
alter table public.admin_audit_log enable row level security;
create policy "admin audit read" on public.admin_audit_log for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin audit write" on public.admin_audit_log for insert to authenticated with check (public.has_role(auth.uid(),'admin') and user_id = auth.uid());

-- seed categories
insert into public.categories (name, slug, sort_order, is_adult, is_kids) values
('Caixas e combos','caixas-e-combos',1,false,false),
('Casais e experiências a dois','casais-e-experiencias-a-dois',2,false,false),
('Produtos +18','produtos-18',3,true,false),
('Jogos e desafios','jogos-e-desafios',4,false,false),
('Presentes criativos','presentes-criativos',5,false,false),
('Datas comemorativas','datas-comemorativas',6,false,false),
('Festas e celebrações','festas-e-celebracoes',7,false,false),
('Lembrancinhas','lembrancinhas',8,false,false),
('Natal','natal',9,false,false),
('Educação infantil','educacao-infantil',10,false,true),
('Alfabetização','alfabetizacao',11,false,true),
('Leitura e escrita','leitura-e-escrita',12,false,true),
('Matemática','matematica',13,false,true),
('Apostilas','apostilas',14,false,true),
('Avaliações e sondagens','avaliacoes-e-sondagens',15,false,true),
('Calendários','calendarios',16,false,false),
('Painéis','paineis',17,false,false),
('Formatura','formatura',18,false,false),
('Kits e combos','kits-e-combos',19,false,false);

insert into public.products (slug, name, category_id, price, short_description, description, details, format, status, is_featured, show_on_home, published_at)
select 'caixa-mensagens-natal-cristao','Caixa de Mensagens Natal Cristão', id, 10,
'Uma lembrança especial para compartilhar fé, esperança e carinho no Natal.',
'Celebre o verdadeiro sentido do Natal com uma caixa especial de mensagens cristãs. O arquivo digital reúne o molde da caixa e cartões com mensagens diferentes para imprimir e montar. Material não editável.',
array['Arquivo digital em PDF, não editável','Molde da caixa com dimensão final de 18 × 18 cm','54 cartões com mensagens diferentes','Cartões organizados em folhas com 9 unidades por página','Arquivo com 7 páginas para impressão'],
'PDF','published',true,true,now()
from public.categories where slug='natal';

-- public active surprise campaign view (only safe fields)
create or replace function public.get_active_campaign()
returns table (id uuid, headline text, message text, code text, discount_type discount_type, discount_value numeric, ends_at timestamptz)
language sql stable security definer set search_path = public as $$
  select ca.id, ca.headline, ca.message, c.code, c.discount_type, c.discount_value, coalesce(ca.ends_at, c.ends_at)
  from public.campaigns ca join public.coupons c on c.id = ca.coupon_id
  where ca.is_active and c.is_active
    and (ca.starts_at is null or ca.starts_at <= now()) and (ca.ends_at is null or ca.ends_at > now())
    and (c.starts_at is null or c.starts_at <= now()) and (c.ends_at is null or c.ends_at > now())
    and (c.max_redemptions is null or c.redemption_count < c.max_redemptions)
  order by ca.created_at desc limit 1
$$;
grant execute on function public.get_active_campaign() to anon, authenticated;
