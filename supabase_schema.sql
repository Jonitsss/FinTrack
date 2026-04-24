-- =============================================
-- FINANZAS PERSONAL — Supabase Schema
-- Corré esto en el SQL Editor de Supabase
-- =============================================

-- Tabla de objetivos/configuración por usuario y mes
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  year int not null,
  month int not null, -- 0-11
  income1 numeric default 0,
  income2 numeric default 0,
  savings_goal numeric default 0,
  reserve numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, year, month)
);

-- Tabla de gastos fijos por usuario y mes
create table if not exists fixed_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  year int not null,
  month int not null,
  name text not null,
  amount numeric not null,
  method text not null default 'tarjeta', -- tarjeta, debito, cuenta, efectivo
  category text not null default 'otro',  -- credito, servicios, suscripcion, seguro, otro
  created_at timestamptz default now()
);

-- Tabla de gastos variables por usuario y mes
create table if not exists variable_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  year int not null,
  month int not null,
  name text not null,
  amount numeric not null,
  method text not null default 'efectivo',
  category text not null default 'otro',
  expense_date date default current_date,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) — cada usuario solo ve sus datos
alter table goals enable row level security;
alter table fixed_expenses enable row level security;
alter table variable_expenses enable row level security;

create policy "Users can manage their own goals"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own fixed expenses"
  on fixed_expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own variable expenses"
  on variable_expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Índices para performance
create index on goals(user_id, year, month);
create index on fixed_expenses(user_id, year, month);
create index on variable_expenses(user_id, year, month);
