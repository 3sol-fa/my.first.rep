-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table messages enable row level security;

-- Create policies
create policy "Messages are viewable by authenticated users only."
  on messages for select
  using ( auth.role() = 'authenticated' );

create policy "Anyone can insert messages."
  on messages for insert
  with check ( true );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql; 