
-- Create a table for integrations (storing tokens)
create table integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null, -- 'google_ads', 'meta_ads'
  refresh_token text, -- Encrypted in application logic or stored raw if RLS matches (recommend encrypting)
  access_token text,
  expires_at bigint, -- Timestamp
  customer_id text, -- Google Ads Customer ID
  manager_id text, -- Google Ads Manager ID (if applicable)
  status text default 'active', -- 'active', 'expired', 'disconnected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure one active integration per provider per user
  unique(user_id, provider)
);

-- Set up RLS for integrations
alter table integrations enable row level security;

create policy "Users can view their own integrations." on integrations
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own integrations." on integrations
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own integrations." on integrations
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own integrations." on integrations
  for delete using ((select auth.uid()) = user_id);
