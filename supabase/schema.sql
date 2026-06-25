-- ============================================================================
-- Karate Atlanta Milton — Portal database schema (Supabase / Postgres)
-- Run this once in your Supabase project:  SQL Editor → paste → Run.
-- ============================================================================

-- 1) PROFILES — one row per logged-in user, holds their role.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'parent' check (role in ('parent','teacher','admin')),
  created_at  timestamptz default now()
);

-- 2) STUDENTS — children, each linked to a parent profile.
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  belt        text default 'White',
  parent_id   uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now()
);

-- 3) ATTENDANCE — one row per student per day.
create table if not exists public.attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  date        date not null default current_date,
  present     boolean not null default true,
  marked_by   uuid references public.profiles(id),
  created_at  timestamptz default now(),
  unique (student_id, date)
);

-- Helper: the current user's role. SECURITY DEFINER so it can read profiles
-- without tripping the row-level-security policies (avoids recursion).
create or replace function public.app_role()
returns text language sql security definer stable set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Auto-create a profile whenever a new auth user signs up (default role: parent).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'parent')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.students   enable row level security;
alter table public.attendance enable row level security;

-- PROFILES: you can read your own; teachers/admins read everyone.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.app_role() in ('teacher','admin'));

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update
  using (id = auth.uid());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update
  using (public.app_role() = 'admin');

-- STUDENTS: parents see their own kids; teachers/admins see & manage all.
drop policy if exists students_select on public.students;
create policy students_select on public.students for select
  using (parent_id = auth.uid() or public.app_role() in ('teacher','admin'));

drop policy if exists students_write on public.students;
create policy students_write on public.students for all
  using (public.app_role() in ('teacher','admin'))
  with check (public.app_role() in ('teacher','admin'));

-- ATTENDANCE: teachers/admins read & write; parents read their kids' rows.
drop policy if exists attendance_select on public.attendance;
create policy attendance_select on public.attendance for select
  using (
    public.app_role() in ('teacher','admin')
    or student_id in (select id from public.students where parent_id = auth.uid())
  );

drop policy if exists attendance_write on public.attendance;
create policy attendance_write on public.attendance for all
  using (public.app_role() in ('teacher','admin'))
  with check (public.app_role() in ('teacher','admin'));
