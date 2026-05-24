-- Flowra Phase 1 MVP database foundation
-- Creates core enum types, user-owned tables, integrity constraints, indexes,
-- updated_at triggers, and Row Level Security policies.

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

create type public.campaign_status as enum (
  'draft',
  'negotiating',
  'confirmed',
  'in_progress',
  'submitted',
  'completed',
  'cancelled'
);

create type public.payment_status as enum (
  'unpaid',
  'partial',
  'paid',
  'overdue'
);

create type public.invoice_status as enum (
  'draft',
  'sent',
  'paid',
  'overdue',
  'void'
);

create type public.expense_category as enum (
  'equipment',
  'software',
  'meals',
  'transport',
  'props',
  'services',
  'other'
);

-- ---------------------------------------------------------------------------
-- Shared trigger helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.validate_expense_campaign_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.campaign_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.campaigns
    where campaigns.id = new.campaign_id
      and campaigns.user_id = new.user_id
  ) then
    raise exception 'Expense campaign_id must reference a campaign owned by the same user.';
  end if;

  return new;
end;
$$;

create function public.validate_invoice_campaign_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.campaign_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.campaigns
    where campaigns.id = new.campaign_id
      and campaigns.user_id = new.user_id
  ) then
    raise exception 'Invoice campaign_id must reference a campaign owned by the same user.';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  creator_name text,
  handle text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_full_name_not_empty
    check (full_name is null or length(trim(full_name)) > 0),
  constraint profiles_creator_name_not_empty
    check (creator_name is null or length(trim(creator_name)) > 0),
  constraint profiles_handle_not_empty
    check (handle is null or length(trim(handle)) > 0)
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_name text not null,
  campaign_title text not null,
  deliverables text not null,
  amount numeric(12, 2) not null default 0,
  status public.campaign_status not null default 'draft',
  payment_status public.payment_status not null default 'unpaid',
  due_date date not null,
  signed_date date,
  published_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint campaigns_brand_name_not_empty
    check (length(trim(brand_name)) > 0),
  constraint campaigns_campaign_title_not_empty
    check (length(trim(campaign_title)) > 0),
  constraint campaigns_deliverables_not_empty
    check (length(trim(deliverables)) > 0),
  constraint campaigns_amount_non_negative
    check (amount >= 0),
  constraint campaigns_published_after_signed
    check (
      published_date is null
      or signed_date is null
      or published_date >= signed_date
    )
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  title text not null,
  category public.expense_category not null default 'other',
  amount numeric(12, 2) not null default 0,
  receipt_path text,
  expense_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint expenses_title_not_empty
    check (length(trim(title)) > 0),
  constraint expenses_amount_non_negative
    check (amount >= 0),
  constraint expenses_receipt_path_not_empty
    check (receipt_path is null or length(trim(receipt_path)) > 0)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  invoice_number text not null,
  client_name text not null,
  amount numeric(12, 2) not null default 0,
  status public.invoice_status not null default 'draft',
  issued_date date not null,
  due_date date not null,
  paid_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invoices_user_invoice_number_unique
    unique (user_id, invoice_number),
  constraint invoices_invoice_number_not_empty
    check (length(trim(invoice_number)) > 0),
  constraint invoices_client_name_not_empty
    check (length(trim(client_name)) > 0),
  constraint invoices_amount_non_negative
    check (amount >= 0),
  constraint invoices_due_after_issued
    check (due_date >= issued_date),
  constraint invoices_paid_after_issued
    check (paid_date is null or paid_date >= issued_date)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index campaigns_user_id_idx on public.campaigns (user_id);
create index campaigns_user_status_idx on public.campaigns (user_id, status);
create index campaigns_user_payment_status_idx on public.campaigns (user_id, payment_status);
create index campaigns_user_due_date_idx on public.campaigns (user_id, due_date);

create index expenses_user_id_idx on public.expenses (user_id);
create index expenses_campaign_id_idx on public.expenses (campaign_id);
create index expenses_user_expense_date_idx on public.expenses (user_id, expense_date);

create index invoices_user_id_idx on public.invoices (user_id);
create index invoices_campaign_id_idx on public.invoices (campaign_id);
create index invoices_user_status_idx on public.invoices (user_id, status);
create index invoices_user_due_date_idx on public.invoices (user_id, due_date);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

create trigger set_expenses_updated_at
before update on public.expenses
for each row
execute function public.set_updated_at();

create trigger validate_expenses_campaign_owner
before insert or update of user_id, campaign_id on public.expenses
for each row
execute function public.validate_expense_campaign_owner();

create trigger set_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

create trigger validate_invoices_campaign_owner
before insert or update of user_id, campaign_id on public.invoices
for each row
execute function public.validate_invoice_campaign_owner();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.expenses enable row level security;
alter table public.invoices enable row level security;

-- Profiles: users can only see and manage their own profile row.
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Campaigns: users can only access campaigns where user_id is their auth UID.
create policy "Users can view own campaigns"
on public.campaigns
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own campaigns"
on public.campaigns
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own campaigns"
on public.campaigns
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own campaigns"
on public.campaigns
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Expenses: users own the row, and linked campaign_id must be null or owned.
create policy "Users can view own expenses"
on public.expenses
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own expenses"
on public.expenses
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    campaign_id is null
    or exists (
      select 1
      from public.campaigns
      where campaigns.id = expenses.campaign_id
        and campaigns.user_id = (select auth.uid())
    )
  )
);

create policy "Users can update own expenses"
on public.expenses
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    campaign_id is null
    or exists (
      select 1
      from public.campaigns
      where campaigns.id = expenses.campaign_id
        and campaigns.user_id = (select auth.uid())
    )
  )
);

create policy "Users can delete own expenses"
on public.expenses
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Invoices: users own the row, and linked campaign_id must be null or owned.
create policy "Users can view own invoices"
on public.invoices
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own invoices"
on public.invoices
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    campaign_id is null
    or exists (
      select 1
      from public.campaigns
      where campaigns.id = invoices.campaign_id
        and campaigns.user_id = (select auth.uid())
    )
  )
);

create policy "Users can update own invoices"
on public.invoices
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    campaign_id is null
    or exists (
      select 1
      from public.campaigns
      where campaigns.id = invoices.campaign_id
        and campaigns.user_id = (select auth.uid())
    )
  )
);

create policy "Users can delete own invoices"
on public.invoices
for delete
to authenticated
using ((select auth.uid()) = user_id);
