-- ==============================================
-- SCRIPT DE CREACIÓN DE TABLA DE PERFILES
-- ==============================================
-- Ejecutar este SQL en Supabase SQL Editor
-- https://supabase.com/dashboard/project/zhcieaqcuycrgtmtwrns/sql/new

-- 1. Crear tabla de perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone varchar(20),
  store_name varchar(100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Política: Los usuarios pueden ver su propio perfil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 4. Política: Los usuarios pueden insertar su propio perfil
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. Política: Los usuarios pueden actualizar su propio perfil
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 6. Función para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 7. Trigger para actualizar updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- ==============================================
-- ✅ SCRIPT COMPLETADO
-- ==============================================
-- Después de ejecutar este script:
-- 1. Verifica que la tabla "profiles" aparezca en Table Editor
-- 2. Verifica que las políticas RLS estén activas
-- ==============================================
