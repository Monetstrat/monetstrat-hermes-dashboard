# MonetStrat Hermes Dashboard

Internal command center for the MonetStrat Hermes operating system.

## Purpose

This dashboard is the internal control room for:

- clients
- onboarding readiness
- Linear tasks
- Hermes workflow progress
- Google Doc outputs
- approval gates
- tool connection status
- system health

## Architecture

- Dashboard: visibility and controls
- Linear: task/project source of truth
- Google Drive/Docs: client files and deliverables
- Supabase: dashboard/workflow database
- Hermes: automation and agent execution
- Netlify: deployment

## First Build

This first version is a static dashboard shell with realistic operating states.
Next build step is connecting Supabase and Linear data.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Netlify build settings:

- Build command: `npm run build`
- Publish directory: `dist`
