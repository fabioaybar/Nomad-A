Fallback DB for NomadA frontend
================================

What this is
------------
This folder contains a small fallback "database" for the frontend. It is used when the app cannot reach the real API/MySQL server. The fallback is seeded from `seed.json` and persisted in the browser using IndexedDB.

Files added
- `seed.json`: initial data used to seed IndexedDB on first run.
- `README.md`: this file.

How it works (frontend)
-----------------------
1. The app imports `src/services/fallbackApi.ts` instead of calling the network directly.
2. `fallbackApi` attempts a normal fetch to `VITE_API_URL + path`.
3. If the network call fails (timeout or unreachable), the call falls back to `src/lib/fallbackDb.ts` which uses IndexedDB.
4. IndexedDB is seeded from `seed.json` on first initialization.

Where to import
---------------
Use the exported `fallbackApi` functions from `src/services/fallbackApi.ts`. Replace or wrap existing service calls so they try the network first but transparently use the fallback when needed.

Notes and limitations
---------------------
- This is a client-side fallback only; it does not sync back to a central database. When the real API comes back up you'll need to decide whether to reconcile local changes with the server.
- For most endpoints this provides basic list/get/create/update/delete behavior. Extend `fallbackApi` and `fallbackDb` if you need additional behaviour (relations, complex queries).

admin@rentacar.com admin123
juan@example.com user123
carlos@autorent.com vendor123