
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create a table for audits
create table audits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  platform text not null, -- 'google', 'meta', etc.
  score integer not null, -- 0-100
  data jsonb not null, -- The full JSON result of the audit
  project_name text -- Optional name for the audit (e.g. client name)
);

-- Set up RLS for audits
alter table audits enable row level security;

create policy "Users can check their own audits." on audits
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own audits." on audits
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own audits." on audits
  for update using ((select auth.uid()) = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
