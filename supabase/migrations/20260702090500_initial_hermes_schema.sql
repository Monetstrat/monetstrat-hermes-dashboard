create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  status text not null default 'intake',
  readiness_score integer not null default 0 check (readiness_score >= 0 and readiness_score <= 100),
  owner text,
  drive_folder_url text,
  linear_project_url text,
  obsidian_path text,
  sales_os_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  workflow_name text not null,
  status text not null default 'ready',
  current_step text,
  blocker text,
  confidence_level text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  workflow_run_id uuid references public.workflow_runs(id) on delete cascade,
  linear_issue_id text,
  title text not null,
  status text not null default 'ready',
  source text not null default 'linear',
  assignee text,
  due_at timestamptz,
  output_url text,
  blocker text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  workflow_task_id uuid references public.workflow_tasks(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  requested_by text,
  reviewer text,
  decision_notes text,
  output_url text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.document_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  workflow_task_id uuid references public.workflow_tasks(id) on delete set null,
  title text not null,
  doc_type text not null,
  url text not null,
  source_system text not null default 'google_drive',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tool_connections (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null unique,
  status text not null default 'pending',
  connection_type text,
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.system_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  event_type text not null,
  severity text not null default 'info',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists workflow_runs_set_updated_at on public.workflow_runs;
create trigger workflow_runs_set_updated_at
before update on public.workflow_runs
for each row execute function public.set_updated_at();

drop trigger if exists workflow_tasks_set_updated_at on public.workflow_tasks;
create trigger workflow_tasks_set_updated_at
before update on public.workflow_tasks
for each row execute function public.set_updated_at();

drop trigger if exists document_links_set_updated_at on public.document_links;
create trigger document_links_set_updated_at
before update on public.document_links
for each row execute function public.set_updated_at();

drop trigger if exists tool_connections_set_updated_at on public.tool_connections;
create trigger tool_connections_set_updated_at
before update on public.tool_connections
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.workflow_tasks enable row level security;
alter table public.approvals enable row level security;
alter table public.document_links enable row level security;
alter table public.tool_connections enable row level security;
alter table public.system_events enable row level security;

insert into public.tool_connections (tool_name, status, connection_type, notes, last_checked_at)
values
  ('linear', 'connected', 'hermes_mcp', 'Hermes Linear MCP connected and tested.', now()),
  ('netlify', 'connected', 'hermes_mcp', 'Hermes Netlify MCP connected; dashboard deployed manually from CLI.', now()),
  ('github', 'connected', 'git', 'Private GitHub repo created and local Git push works.', now()),
  ('google_drive', 'partial', 'codex_connector', 'Codex Drive connector works and root folders created; direct Hermes Drive MCP pending.', now()),
  ('obsidian', 'connected', 'local_folder', 'Local MonetStrat OS vault created and attached to Hermes project.', now()),
  ('supabase', 'partial', 'cli', 'Supabase CLI linked; Hermes MCP OAuth blocked by browser account/org mismatch.', now()),
  ('slack', 'pending', 'gateway', 'Slack manifest generated; app install and tokens needed.', now()),
  ('telegram', 'pending', 'gateway', 'Telegram bot token and chat ID needed.', now())
on conflict (tool_name) do update
set status = excluded.status,
    connection_type = excluded.connection_type,
    notes = excluded.notes,
    last_checked_at = excluded.last_checked_at,
    updated_at = now();
