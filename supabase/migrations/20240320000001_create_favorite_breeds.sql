-- Create favorite_breeds table
create table favorite_breeds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  breeds_id text not null,
  memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, breeds_id)
);

-- Enable Row Level Security
alter table favorite_breeds enable row level security;

-- Create policies
create policy "Users can view their own favorite breeds."
  on favorite_breeds for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own favorite breeds."
  on favorite_breeds for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own favorite breeds."
  on favorite_breeds for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own favorite breeds."
  on favorite_breeds for delete
  using ( auth.uid() = user_id );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_favorite_breeds_updated_at
  before update on favorite_breeds
  for each row execute procedure update_updated_at_column(); 