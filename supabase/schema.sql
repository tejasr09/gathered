-- Gathered prototype database. Run once in Supabase SQL Editor.
create table if not exists public.events (
  id text primary key,
  name text not null,
  description text not null,
  date date not null,
  time text not null,
  venue text not null,
  city text not null default '',
  category text not null,
  capacity integer not null check (capacity > 0),
  status text not null check (status in ('Open', 'Filling fast', 'Full', 'Draft')),
  image text not null,
  tone text not null,
  price text not null,
  organizer text not null,
  "organizerId" uuid not null references auth.users(id) on delete cascade
);

create table if not exists public.registrations (
  id text primary key,
  "eventId" text not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  "registrationDate" date not null default current_date,
  status text not null check (status in ('Confirmed', 'Waitlist', 'Cancelled')),
  "ticketType" text not null default 'Standard' check ("ticketType" in ('Standard', 'VIP')),
  quantity integer not null default 1 check (quantity between 1 and 4),
  "unitPrice" integer not null default 0,
  "ticketCode" text,
  "attendeeId" uuid references auth.users(id) on delete set null,
  "checkedIn" boolean not null default false,
  rating integer check (rating between 1 and 5)
);

alter table public.events enable row level security;
alter table public.registrations enable row level security;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant select, insert, update on public.registrations to authenticated;

drop policy if exists "Anyone can browse published events" on public.events;
create policy "Anyone can browse published events" on public.events for select using (status <> 'Draft' or "organizerId" = auth.uid());
drop policy if exists "Organizers manage their own events" on public.events;
create policy "Organizers manage their own events" on public.events for all using ("organizerId" = auth.uid()) with check ("organizerId" = auth.uid());

drop policy if exists "Guests and event hosts can view registrations" on public.registrations;
create policy "Guests and event hosts can view registrations" on public.registrations for select using (
  "attendeeId" = auth.uid() or exists (select 1 from public.events e where e.id = "eventId" and e."organizerId" = auth.uid())
);
drop policy if exists "Guests can register for themselves" on public.registrations;
create policy "Guests can register for themselves" on public.registrations for insert with check (
  "attendeeId" = auth.uid() and status = 'Confirmed' and "checkedIn" = false and rating is null
);
drop policy if exists "Event hosts update their guest records" on public.registrations;
create policy "Event hosts update their guest records" on public.registrations for update using (
  exists (select 1 from public.events e where e.id = "eventId" and e."organizerId" = auth.uid())
) with check (
  exists (select 1 from public.events e where e.id = "eventId" and e."organizerId" = auth.uid())
);
