# Connecting a backend (not implemented)

Pages only call the services in `src/services/`. Replace the bodies, keep the signatures and return shapes.
Nothing below is built or tested; it is a plan (Supabase is one option).

## Service contracts (all async; throw `Error` with a readable message)
| Service | Methods |
| --- | --- |
| `dressService` | `list()`, `listAll()`, `listFeatured(limit)`, `getById(id)` (null if missing/archived), `create(data)`, `update(id, data)`, `setArchived(id, bool)`, `reset()` (demo only: remove) |
| `availabilityService` | `list()`, `addPeriod({dressId,type,start,end})`, `removePeriod(id)`, `restoreRange(dressId,start,end)`, `markUnavailable(dressId)`, `resume(dressId)`, `reset()` (demo only) |
| `imageService` | `prepare(file)` returns a string usable as `<img src>` |

Availability mutations return the full period list. `getStatus` is a pure function and stays in the front end.

## Shapes
- Dress: `{ id, code, name, price, description, color, sizes[], categories[], measurements|null, images[], featured, archived, isSample, updatedAt }`
- Period: `{ id, dressId, type: 'reserved'|'blocked'|'unavailable', start: 'YYYY-MM-DD', end: 'YYYY-MM-DD'|null }`

## Database
- `dresses`: columns as above; `code` unique (case-insensitive)
- `periods`: foreign key to dresses; check `end >= start`; prevent overlapping dated rentals/blocks in the database
- Make `restoreRange` a single transaction (database function)
- Visitors should not read private details. Do not add customer data to publicly readable tables.

## Images
Upload the resized file to object storage in `imageService.prepare` and return its public URL.
Decide how to delete files that are no longer used (including uploads from a cancelled form).

## Owner authentication
Use the provider's auth. Enforce write access on the server (row-level security: public read of active dresses and
periods, writes for the owner only). Hiding the `/dashboard` route is not security. Never put secret keys in `VITE_` variables.

## Shared updates
Real sharing comes from the database. Live refresh needs a subscription or refetch on focus, added in `useAsync`
or a new hook. Then remove the "Local demo" notice and the sample data.
