# Provider-Neutral Release Runbook

## Release boundary

PhaseBench supports a standard Next.js Node.js deployment. This runbook prepares a reproducible release but does not select a hosting provider or authorize a public deployment. The first public release waits for an explicit provider decision and approval.

The current MVP serves synthetic evidence from bundled fixtures. It has no external database, provider API, background worker, or required application environment variable.

## Runtime contract

- Linux or Windows environment capable of running Node.js 20.19.0 and npm 10.
- `npm ci` access to the public npm registry during the build.
- `npm run build` as the build command.
- `npm run start` as the runtime command; providers may supply their own port through the standard Next.js runtime environment.
- Persistent storage is not required for the fixture MVP.
- `GET /api/health` as the health probe. A healthy instance returns HTTP 200 and `{ "status": "ok", "service": "phasebench", "evidence": "synthetic" }` with `Cache-Control: no-store`.

Static export is not the release target. Dashboard and comparison routes use request-time URL parameters, and the provider should support the complete Next.js Node.js runtime.

## Environment variables and secrets

`.env.example` is the source of truth for application configuration names. It is intentionally empty today because the MVP requires none. `.env*` files containing values are ignored by Git, while `.env.example` is committed.

Do not add API keys, tokens, database URLs, webhook secrets, or provider credentials to source, fixtures, workflow files, build arguments, logs, or client-prefixed variables. When M4 introduces configuration:

1. add only the variable name and safe explanation to `.env.example`;
2. validate required values on the server at startup;
3. configure values through the host's encrypted secret manager;
4. scope credentials to the minimum provider permissions;
5. define rotation and revocation ownership before release;
6. verify that secrets are unavailable to browser bundles and preview logs.

## Build and release procedure

1. Select an immutable Git commit from `master` whose `Verify proposed changes` workflow passed.
2. Use Node.js 20.19.0, matching `.nvmrc`.
3. Run `npm ci` from a clean checkout.
4. Run `npm run verify`.
5. For UI or dependency changes, also run `npm run accessibility` and `npm run performance` as applicable.
6. Run `npm run build` in the release environment.
7. Preserve the commit SHA and build logs with the release record.
8. Start with `npm run start` behind the provider's HTTPS endpoint or reverse proxy.
9. Probe `/api/health`, then smoke-test `/`, `/comparison`, `/runs`, one model detail, and one run detail.
10. Confirm every product surface still labels the evidence as synthetic.

Build once per release and promote the same immutable commit or artifact between environments. Do not rebuild an older release during rollback with newly resolved dependencies; the lockfile and retained artifact are part of the release evidence.

## Health and operational checks

The health endpoint proves that the Next.js process can serve requests. It does not currently test an external dependency because none exists. Add dependency-specific readiness checks only when SQLite, provider APIs, or a scheduler become runtime requirements; keep liveness independent so a transient provider outage does not cause restart loops.

After deployment, verify:

- health returns 200 without caching;
- primary routes return successful responses;
- server logs contain no startup, rendering, or hydration failures;
- the theme and URL-backed filters work;
- synthetic labels are visible;
- response sizes remain within the documented performance budgets.

## Rollback

1. Stop promotion and record the failing release SHA and symptoms.
2. Redeploy the most recent previously verified immutable artifact or commit.
3. Probe `/api/health` and repeat the smoke routes.
4. Confirm logs and synthetic-data labels.
5. Keep the failed release available for diagnosis; do not force-push or rewrite `master`.

The fixture MVP has no data migration rollback. Before persistent storage is released, every migration task must define backup, compatibility, forward-fix, and rollback constraints separately. A code rollback must never assume that destructive schema reversal is safe.

## Hosting-provider decision criteria

Evaluate candidates against the same requirements rather than adapting the product prematurely:

| Criterion             | MVP requirement                                                                |
| --------------------- | ------------------------------------------------------------------------------ |
| Next.js compatibility | Supports the full Node.js runtime and the pinned Next.js version               |
| Reproducibility       | Immutable deployments from Git SHA or retained artifact                        |
| Secrets               | Encrypted environment management with audit and rotation support               |
| Health and rollback   | HTTP probes, useful logs, fast rollback to a known release                     |
| Preview safety        | Isolated preview deployments without production credentials                    |
| Regions and latency   | Suitable region for intended users with HTTPS and CDN support                  |
| Scheduled work        | Clear path for the future daily runner without coupling web requests to jobs   |
| Persistence           | Clear future option for durable SQLite volume or migration to managed SQL      |
| Observability         | Request, error, deployment, and resource metrics with retention controls       |
| Cost and limits       | Predictable build/runtime pricing, timeouts, concurrency, and bandwidth limits |
| Portability           | Standard build/start commands and exportable data; minimal proprietary lock-in |

Document the chosen provider and rejected alternatives in an architecture decision record before adding provider-specific configuration.
