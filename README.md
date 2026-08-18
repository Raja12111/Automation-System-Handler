# Automation System Handler

Vercel handler for [RankBrain X / OptiSync](https://github.com/Raja12111/OptiSync). RankBrain X dispatches automation jobs here; this service acknowledges them and calls back into RankBrain X.

Production: https://automation-system-handler.vercel.app  
OptiSync / RankBrain X: https://rankbrainx.com  
Vercel team: **opti-sync1**. GitHub: [Raja12111/Automation-System-Handler](https://github.com/Raja12111/Automation-System-Handler). Pushes to `main` auto-deploy.

## Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | no | Status page |
| GET | `/admin` | RankBrain X admin login | Admin Settings (prompts + credits) |
| POST | `/api/admin/login` | RankBrain X admin email/password | Issue admin session token |
| GET | `/api/health` | no | Liveness + config flag |
| GET/POST | `/api/optisync` | Bearer `HANDLER_SECRET` or admin token | Handshake with RankBrain X |
| GET/POST | `/api/jobs` | Bearer `HANDLER_SECRET` | Accept a job and record it on RankBrain X |
| GET/PUT | `/api/admin/prompts` | Admin session | RankBrain X meta-tag prompts |
| GET/POST | `/api/admin/credits` | Admin session | AI Generation Credits |
| GET/POST | `/api/admin/users` | Admin session | List sign-ups and create users |
| GET/POST | `/api/admin/super-credits` | Admin session | Super Credits (Authority Hype only) |
| GET/POST | `/api/admin/subscriptions` | Admin session | $69/website/month subscriptions |
| GET/PUT | `/api/admin/api-usage` | Admin session | OpenAI + Claude remaining usage |
| GET | `/api/admin/tickets` | Admin session | Support tickets |
| GET/POST | `/api/admin/tickets/:id` | Admin session | Ticket detail + updates |

## Environment

Set on Vercel (Production + Preview):

- `HANDLER_SECRET` — shared with RankBrain X `AUTOMATION_HANDLER_SECRET`
- `OPTISYNC_URL` — `https://rankbrainx.com`

On RankBrain X / OptiSync:

- `AUTOMATION_HANDLER_URL` — this project's production URL
- `AUTOMATION_HANDLER_SECRET` — same value as `HANDLER_SECRET`

## Deploy

Pushes to `main` auto-deploy on Vercel after the GitHub repo is connected.
