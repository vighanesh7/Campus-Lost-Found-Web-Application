# Campus Lost & Found

A full-stack web app where college students report **lost** and **found** items, search and filter them, message each other, get notifications, and where admins moderate everything.
Built for the **CSA-301 Full Stack Development** syllabus.

**Stack:** React + Vite + React Router + Redux Toolkit + Axios (frontend) · Node.js + Express + Sequelize + MySQL + JWT + Multer + node-cron (backend)

> Read **EXPLANATION.md** for a plain-English walkthrough of every part (good for your viva).

---

## 1. What you need installed

| Tool | Version | Check with |
|---|---|---|
| Node.js | 18 or newer (20 LTS recommended) | `node -v` |
| npm | comes with Node | `npm -v` |
| MySQL Server | 8.x (or MariaDB 10.5+, or XAMPP's MySQL) | `mysql --version` |
| VS Code + Git | optional but recommended | |

## 2. Folder structure

```
campus-lost-found/
├── backend/          Express API, Sequelize models, migrations, seeders, cron job
│   ├── src/ (config, controllers, services, routes, middleware, models, validators, events, jobs, queries, utils, uploads)
│   ├── migrations/   one file per table
│   ├── seeders/      users, categories, items
│   ├── tests/smoke.js  API test script
│   └── server.js
├── frontend/         React app (Vite)
│   └── src/ (components, pages, redux, services, hooks, context, utils)
├── webpack-demo/     tiny Webpack example (syllabus only)
├── database/schema.sql   plain SQL version of the tables (reference)
├── docs/             ER diagram, schema, API docs, syllabus mapping
├── EXPLANATION.md    full explanation of the project
└── README.md
```

## 3. Setup (step by step)

### Step 1 - Get the code
Unzip the project (or `git clone` your repo) and open the folder in VS Code.

### Step 2 - Create the MySQL database
Start MySQL (XAMPP: press *Start* next to MySQL). Then either use phpMyAdmin (create a database named `campus_lost_found`, collation `utf8mb4_unicode_ci`) or the terminal:

```bash
mysql -u root -p -e "CREATE DATABASE campus_lost_found CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```
Only create the **empty database**. Sequelize migrations create the tables.

### Step 3 - Configure the backend
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
Open `backend/.env` and set:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=campus_lost_found
DB_USER=root
DB_PASSWORD=your_mysql_password   # XAMPP default is empty
JWT_SECRET=put_a_long_random_text_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
Generate a secret quickly: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 4 - Create tables and sample data
Still inside `backend/`:
```bash
npm run migrate      # = npx sequelize-cli db:migrate   (creates 12 tables)
npm run seed         # = npx sequelize-cli db:seed:all  (users, categories, 10 items)
```
Start over any time with `npm run db:reset`.

### Step 5 - Start the backend
```bash
npm run dev          # auto-restarts on changes. Use `npm start` for plain node
```
You should see `MySQL connected via Sequelize` and `API running on http://localhost:5000/api`.
Check it: open <http://localhost:5000/api/health> in a browser.

### Step 6 - Start the frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev
```
Open **http://localhost:5173**.

## 4. Test accounts (created by the seeder)

| Role | Email | Password |
|---|---|---|
| Admin | admin@campus.edu | Admin@123 |
| Student | aarav@campus.edu | Student@123 |
| Student | meera@campus.edu | Student@123 |
| Student | rohan@campus.edu | Student@123 |

New sign-ups on the Register page are always **students**. Change the demo passwords before showing the project publicly.

## 5. Useful commands

| Where | Command | What it does |
|---|---|---|
| backend | `npm run dev` / `npm start` | run the API |
| backend | `npm run migrate` / `migrate:undo` | create / drop all tables |
| backend | `npm run seed` | insert sample data |
| backend | `npm test` | API smoke test (**server must be running**, needs Node 18+) |
| backend | `npm run job:stale` | run the daily cron job once, right now |
| backend | `npm run cli stats` | command-line-arguments demo (prints totals via raw SQL) |
| backend | `node src/utils/asyncExamples.js` | blocking vs non-blocking demo |
| backend | `node src/utils/streamExamples.js` | streams demo |
| backend | `node server.js --port=5001` | run on another port (CLI arguments) |
| frontend | `npm run dev` / `build` / `preview` | dev server / production build / preview build |
| webpack-demo | `npm install && npm run build` | Webpack bundle demo |

## 6. Quick feature tour (to verify everything works)
1. Open the site, click **Get Started**, register (or log in as `aarav@campus.edu`).
2. **Home** shows live counts from MySQL. Click **Report Lost** and submit a report with a photo.
3. **Search** an item (e.g. "iphone"), filter by category, location and date.
4. Open an item as another user, click **Contact Reporter**, send a message, then log in as the reporter and read it under **Messages**.
5. Check **Notifications** (Today / Earlier), save an item with the heart, view **Favourites**.
6. Log in as `admin@campus.edu` and open **Admin** in the sidebar: dashboard, users, items, reports, categories, CSV export.

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `ER_ACCESS_DENIED_ERROR` | Wrong `DB_USER` / `DB_PASSWORD` in `backend/.env`. |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL is not running. Start it (XAMPP / `services.msc` / `brew services start mysql`). |
| `Unknown database 'campus_lost_found'` | Do Step 2 first. |
| `Missing env variable: JWT_SECRET` | `.env` missing or JWT_SECRET empty. |
| Migrate says "Cannot find config" | Run the command inside `backend/`. |
| Table already exists | You imported `database/schema.sql` *and* ran migrations. Use `npm run migrate:undo` then `npm run migrate`, or drop/recreate the DB. |
| Frontend shows "Cannot reach the server" | Backend not running, or `VITE_API_URL` wrong. Restart `npm run dev` after editing `.env`. |
| CORS error in the browser console | `CLIENT_URL` in backend `.env` must equal the frontend address exactly (`http://localhost:5173`). |
| Images do not show | They load from `http://localhost:5000/uploads/...`. Check the backend is running and `src/uploads` exists. |
| Port 5000 busy (macOS AirPlay) | Use `PORT=5001` in backend `.env` and `VITE_API_URL=http://localhost:5001/api`. |
| `EADDRINUSE` | Another process uses the port; stop it or change the port. |
| 401 after a while | Token expired (7 days) - log in again. |

## 8. Honest status
Everything was written to run end to end, and all files pass a syntax check plus an import/export consistency check. It was authored in an offline sandbox, so `npm install`, MySQL and a browser run were **not** executed there. Expect to run it once, and if anything errors, copy the message from the terminal and fix or ask for help. `npm test` gives a fast way to check the whole API.

## 9. Known limits (by design, college scope)
- JWT is kept in `localStorage` (simple, but exposed to XSS; production apps often use httpOnly cookies).
- Images are saved on the server disk (`backend/src/uploads`), not cloud storage.
- Messages refresh by polling (8-30 s) instead of WebSockets.
- Matching is rule-based (keywords, category, date, place), not AI.
- No password-reset email flow.
