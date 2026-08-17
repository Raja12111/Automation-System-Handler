# Automation System Handler

Vercel handler for [OptiSync](https://github.com/Raja12111/OptiSync). OptiSync dispatches automation jobs here; this service acknowledges them and can call back into OptiSync.

Production: https://automation-system-handler.vercel.app  
Vercel team: **opti-sync1**. GitHub: [Raja12111/Automation-System-Handler](https://github.com/Raja12111/Automation-System-Handler). Pushes to `main` auto-deploy.

## Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | no | Status page |
| GET | `/admin` | OptiSync admin login | Admin Settings (prompts + credits) |
| POST | `/api/admin/login` | OptiSync admin email/password | Issue admin session token |
| GET | `/api/health` | no | Liveness + config flag |
| GET/POST | `/api/optisync` | Bearer `HANDLER_SECRET` | Handshake with OptiSync |
| GET/POST | `/api/jobs` | Bearer `HANDLER_SECRET` | Accept a job payload |
| GET/PUT | `/api/admin/prompts` | Bearer `HANDLER_SECRET` | OptiSync meta-tag prompts |
| GET/POST | `/api/admin/credits` | Bearer `HANDLER_SECRET` | OptiSync AI Generation Credits |

## Environment

Set on Vercel (Production + Preview):

- `HANDLER_SECRET` — shared with OptiSync `AUTOMATION_HANDLER_SECRET`
- `OPTISYNC_URL` — `https://opti-sync-pied.vercel.app`

On OptiSync:

- `AUTOMATION_HANDLER_URL` — this project's production URL
- `AUTOMATION_HANDLER_SECRET` — same value as `HANDLER_SECRET`

## Deploy

Pushes to `main` auto-deploy on Vercel after the GitHub repo is connected.
