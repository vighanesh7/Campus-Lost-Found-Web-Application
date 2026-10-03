# Campus Lost & Found - Project Explanation

This document explains **what was built, how it works, and why**, in simple language. Use it to prepare for your practical / viva.

---
## 1. The idea
Students lose things on campus (phones, ID cards, bags) and other students find them. This website gives both groups one place to **report**, **search**, **chat** and **track** items until they are returned. Admins moderate the content.

## 2. Big picture (how the pieces talk)

```
Browser (React)  ->  Axios  ->  Express routes  ->  Controller  ->  Service  ->  Sequelize model  ->  MySQL
      ^                                                                                              |
      +----------------------------- JSON response (success, message, data) <------------------------+
```
- **React** shows pages and keeps UI state (Redux Toolkit for shared state).
- **Axios** (`frontend/src/services/api.js`) sends HTTP requests with the JWT in the `Authorization` header.
- **Express** receives the request. A **route** picks the right **controller**; the controller calls a **service** (business logic); the service uses **Sequelize models** to read/write **MySQL**.
- Every response has the same shape: `{ success, message, data }` or `{ success:false, message, errors }`.

## 3. Why each technology (viva answers)

| Tech | Why we used it |
|---|---|
| **React** | Build the UI from reusable components (ItemCard is written once, used on 6 pages). Fast updates through the virtual DOM. |
| **Vite** | Very fast dev server and build tool. Needs almost no configuration compared with Webpack. |
| **React Router** | Gives a single-page app real URLs (`/items/25`) and protected routes without page reloads. |
| **Redux Toolkit** | One global store for data many pages need (logged-in user, items, favourites, notifications, messages). Less boilerplate than classic Redux. |
| **Axios** | Cleaner than `fetch`: base URL, interceptors (auto-attach token, auto-logout), JSON handling, timeouts. |
| **Node.js** | Run JavaScript on the server; non-blocking I/O is perfect for an API that mostly waits on a database. |
| **Express** | Minimal web framework: routing + middleware. |
| **Sequelize** | ORM: we describe tables as JavaScript models and call `findAll()`/`create()` instead of writing SQL strings. Gives validation, associations, migrations. |
| **MySQL** | Relational database: our data (users, items, messages) is naturally related and needs foreign keys and constraints. |
| **JWT + bcrypt** | Stateless login tokens + safe password storage. |
| **Multer** | Handles `multipart/form-data` image uploads. |
| **node-cron** | Runs a scheduled job (daily reminders). |

## 4. Folder-by-folder tour

### Backend (`backend/src`)
| Folder | Role | Example |
|---|---|---|
| `config/` | Database config + environment variables | `config.js` is used by Sequelize CLI *and* the app |
| `models/` | One file per table + `index.js` which loads them and defines **associations** | `Item.js` |
| `routes/` | URL -> controller mapping. `apiGateway.js` mounts every module under `/api` | `itemRoutes.js` |
| `controllers/` | Reads `req`, calls a service, sends the response (thin) | `itemController.js` |
| `services/` | Real business logic and database calls | `itemService.js`, `matchingService.js` |
| `middleware/` | Reusable request steps: auth, roles, upload, validation result, errors, logging | `authMiddleware.js` |
| `validators/` | express-validator rules per endpoint | `itemValidators.js` |
| `events/` | EventEmitter + listeners (notifications, matching) | `listeners.js` |
| `jobs/` | Cron job | `staleReportsJob.js` |
| `queries/` | Raw SQL reports | `statsQueries.js` |
| `utils/` | Helpers: ApiError, fs helpers, CSV stream, demos | `csvStream.js` |
| `migrations/`, `seeders/` | Create tables / insert sample rows | |

### Frontend (`frontend/src`)
| Folder | Role |
|---|---|
| `pages/` | One component per screen (Home, SearchItems, ReportItem, ItemDetails, Messages, Profile, admin/...) |
| `components/` | Reusable parts: `layout/` (Sidebar, Navbar, MobileBottomNav), `common/` (Modal, Spinner...), `items/` (ItemCard, filters), `messages/`, `notifications/`, `forms/`, `admin/` |
| `redux/` | store + slices: auth, items, favorites, notifications, messages |
| `services/api.js` | Axios client |
| `hooks/` | `useDebounce`, `useCategories`, `useItemActions` |
| `context/` | `ToastContext` (pop-up messages) |
| `utils/` | formatting, error helpers, constants |

## 5. Database

**12 tables:** `users, categories, items, item_images, favorites, conversations, conversation_participants, messages, notifications, reports, audit_logs, item_matches`. Full details: `docs/DATABASE_SCHEMA.md`; diagram: `docs/ER_DIAGRAM.md`.

- **Model** = a JavaScript class that represents a table (`Item` <-> `items`).
- **Migration** = a versioned script that creates/changes a table (`up`) and can undo it (`down`). Like Git for your database structure. Run with `npm run migrate`.
- **Seeder** = script inserting starter data (`npm run seed`).
- **Association** = relationship between models, which becomes a foreign key:
  - **1:M** (one-to-many): one User has many Items (`User.hasMany(Item)`, `Item.belongsTo(User)`). Also Category->Items, Item->ItemImages.
  - **M:N** (many-to-many): needs a join table. Users <-> Conversations via `conversation_participants`; Users <-> Items via `favorites`; Items <-> Items via `item_matches`. Written with `belongsToMany`.
  - **1:1** (one-to-one): one User has one Profile (`hasOne`/`belongsTo`). Our profile fields live inside `users`, so we did not need a separate table; in the viva say: "`hasOne` would be used if profile data were split into its own table".
- **Constraints:** primary keys, unique (`email`, `studentId`, `userId+itemId` in favourites), NOT NULL, foreign keys with `ON DELETE CASCADE / SET NULL / RESTRICT`.

## 6. Feature walkthroughs

### 6.1 Authentication & JWT
1. **Register** `POST /api/auth/register`: validators check fields -> `authService.register` hashes the password with **bcrypt** (a salted one-way hash; it can only be compared, never reversed) -> user saved -> a **JWT** is returned.
2. **Login** `POST /api/auth/login`: finds the user, `bcrypt.compare()` checks the password, returns a JWT. The same message is used for "wrong email" and "wrong password" so attackers can't learn which emails exist.
3. A **JWT** is a signed text token containing `{id, role}` and an expiry. The server signs it with `JWT_SECRET`; anyone can read it but nobody can change it without breaking the signature.
4. Frontend stores the token in `localStorage`; an Axios **interceptor** adds `Authorization: Bearer <token>` to every request.
5. `authMiddleware.protect` verifies the token and loads the user into `req.user`. On page refresh React calls `GET /api/auth/me` to restore the session.
6. **Logout** = frontend deletes the token (JWT is stateless).
7. Passwords are never returned: the `User` model has a `defaultScope` that excludes the `password` field.

### 6.2 Authorization (roles)
- `roleMiddleware.adminOnly` blocks non-admins with **403** on every `/api/admin/*` route and on report moderation.
- Services check ownership: only the item owner or an admin can edit/delete/change status.
- React also hides admin links (`ProtectedRoute adminOnly`), but **security is enforced by the backend**, because UI hiding can be bypassed.

### 6.3 Items, search, filters, pagination
`GET /api/items?type=lost&category=electronics&location=library&search=iphone&page=1&limit=12`
- `itemService.list` builds a Sequelize `where` object from the query string (`Op.like` for search/location), joins category/reporter/images with `include`, and uses **`findAndCountAll`** with `limit/offset` for pagination. Response: `items, currentPage, totalPages, totalItems`.
- On the frontend `ItemBrowser` keeps filters in `useState`, debounces typing (`useDebounce`), builds the params with `useMemo`, and dispatches `fetchItems`.

### 6.4 Reporting an item + image upload
- `ReportItem` uses `useReducer` for the form state, validates in the browser, then sends **FormData**.
- Backend order: **Multer** (saves file to `src/uploads`, checks type JPG/PNG/WEBP, max 5 MB) -> express-validator -> controller -> service. The DB stores the path (`/uploads/123.jpg`); Express serves that folder statically. If validation fails, the uploaded file is deleted again.
- After creating an item the service **emits an event** `itemReported`.

### 6.5 Events, notifications, matching
- **EventEmitter** (`events/appEvents.js`): services *emit* (`itemReported`, `itemResolved`, `itemStatusChanged`, `messageSent`); `events/listeners.js` *listens* and creates notifications. This keeps services decoupled.
- **Matching** (`matchingService.js`): when an item is reported, search the opposite type (lost<->found) with the same category within +-30 days; score by shared words in the name (strong), description, and location; if score >= 45 save in `item_matches` and notify both owners. It is **rule-based, not AI**.
- Notifications API groups results into **Today / Earlier**; the sidebar badge shows unread count (polled every 30 s).

### 6.6 Messaging
- Tables: `conversations`, `conversation_participants` (M:N), `messages`.
- "Contact Reporter" sends `POST /api/messages {recipientId, itemId, message}`; the service re-uses an existing conversation for the same two users and item, or creates one inside a **transaction**.
- Opening a thread marks the other person's messages as read (`readAt`). The chat polls every 8 s.
- Contact details (email/phone) are never exposed; all contact goes through messages.

### 6.7 Favourites
`favorites` join table with a **unique (userId, itemId)** constraint. `findOrCreate` makes adding idempotent. Redux `favoriteSlice` keeps the list of IDs so the heart icon is filled on every card.

### 6.8 Status workflow
`ACTIVE -> PENDING -> MATCHED -> RETURNED -> RESOLVED -> CLOSED`. Owners can set ACTIVE/RETURNED/RESOLVED/CLOSED; only admins can set PENDING/MATCHED. Changes emit events that notify people.

### 6.9 Reports (complaints) & admin
Any user can report a *post* (spam, inappropriate...). Admin sees reports, adds notes, and approves (item becomes CLOSED), rejects, or resolves. Every admin action is written to `audit_logs`. The dashboard (`GET /api/admin/stats`) shows totals from **raw SQL**.

### 6.10 Raw SQL (syllabus)
`backend/src/queries/statsQueries.js` uses `sequelize.query()` with **named replacements** (`:userId`, `:limit`) so values are escaped (prevents SQL injection). Used for: item totals (lost/found/resolved), pending count, top categories, common lost locations, reports per month, user count, report status counts. Normal CRUD uses the ORM.

### 6.11 Streams / CSV export
`GET /api/admin/export/items` -> `csvStream.js` reads rows from MySQL in batches of 200 through an **async generator**, wraps it in a **Readable stream**, and `pipeline()`s it into the HTTP response (a **Writable stream**). Memory stays small even for millions of rows (non-blocking I/O).

### 6.12 Cron job
`jobs/staleReportsJob.js` is scheduled with `node-cron` at `0 0 * * *` (midnight): reminds owners of ACTIVE items older than 30 days (max one reminder per week) and notifies admins about reports pending > 7 days. Run it manually with `npm run job:stale`.

### 6.13 Error handling
- `ApiError` class for expected errors (401, 403, 404, 409...).
- `asyncHandler` forwards rejected promises to the central `errorMiddleware`, which converts Sequelize/JWT/Multer errors into safe messages (never raw SQL errors).
- Frontend: `getErrorInfo()` turns any Axios error into a friendly message; every screen shows **loading / error (with retry) / empty / success** states.

### 6.14 Security checklist
bcrypt hashing · JWT · role checks on the server · express-validator on all inputs · Sequelize parameterized queries + replacements · upload type/size limits and random filenames · CORS limited to `CLIENT_URL` · secrets in `.env` (not in Git) · password never returned · reporter contact info hidden.

## 7. React concepts - where to point in the viva
| Concept | File |
|---|---|
| Components & props | `ItemCard.jsx`, `ItemGrid.jsx` (`item`, `onFavorite`, `onView`) |
| `useState` | filters in `ItemBrowser.jsx`, modals in `ItemDetails.jsx` |
| `useReducer` | `ReportItem.jsx` |
| `useEffect` | data fetching in every page; polling in `AppLayout.jsx`, `ChatThread.jsx` |
| `useRef` | file input / focus in `ReportItem.jsx`, auto-scroll in `ChatThread.jsx` |
| `useMemo` | `ItemBrowser.jsx` params, `Favorites.jsx` filtered list |
| `useCallback` | `useItemActions.js`, `ToastContext.jsx` |
| `useContext` | `ToastContext.jsx` |
| React Router | `App.jsx` (routes), `ProtectedRoute.jsx`, `useParams`, `useNavigate`, `NavLink` |
| Redux Toolkit | `redux/*Slice.js`, `createAsyncThunk` via `apiThunk.js`, `useSelector/useDispatch` |

## 8. Node.js syllabus concepts - where to point
| Topic | Where |
|---|---|
| Node REPL, `node -v`, running scripts | run `node` in a terminal, try `require('./src/utils/asyncExamples')` |
| package.json, scripts, dependencies | `backend/package.json` |
| Modules / `require` / `module.exports` | every backend file |
| Event loop, blocking vs non-blocking, callbacks, promises | `utils/asyncExamples.js` |
| Async/await, try/catch, promise chaining | services, `asyncHandler.js` |
| EventEmitter | `events/` |
| File system (`fs/promises`) | `utils/fileUtils.js` (dirs, logs, delete files) |
| Streams (readable/writable/standard) | `utils/csvStream.js`, `utils/streamExamples.js` |
| Command-line arguments | `server.js --port=`, `utils/cli.js` |
| Request headers | `requestLogger.js`, `authMiddleware.js` |
| Routes / gateway | `routes/apiGateway.js` |
| Cron | `jobs/staleReportsJob.js` |
| Webpack | `webpack-demo/` |

## 9. Responsive design (website vs. Figma mobile)
- **Mobile (< 1024 px):** looks like the Figma app - top bar, 2-column cards, **bottom navigation** (Home, Search, Report, Message, Profile), Messages shows list OR chat.
- **Desktop (>= 1024 px):** purple **sidebar** replaces the bottom nav, top bar gets a search box, item grids grow to 3-4 columns, Home shows Lost and Found side by side, Item Details becomes image + info columns, Messages becomes list + chat panels.
- Figma colours reused: royal-blue primary, red/green/purple/yellow stat tiles, rounded cards, lavender notification cards, same page names and order. Fonts: Ubuntu.

## 10. Likely viva questions (short answers)
1. **How does the frontend talk to the backend?** Axios sends HTTP/JSON requests to REST endpoints under `/api`; Redux thunks wrap those calls.
2. **What is REST?** URLs name resources (`/items/5`) and HTTP verbs say the action (GET read, POST create, PUT/PATCH update, DELETE remove).
3. **What is middleware?** A function `(req,res,next)` that runs before the controller (auth, validation, upload, logging).
4. **Difference between authentication and authorization?** Authentication = who are you (login/JWT). Authorization = what may you do (roles/ownership).
5. **Why hash passwords?** If the DB leaks, attackers still can't read passwords. bcrypt is slow on purpose and salted.
6. **What is an ORM?** Maps tables to objects so we avoid hand-written SQL; Sequelize.
7. **Migration vs seeder?** Migration changes *structure*; seeder inserts *data*.
8. **Why a service layer?** Keeps controllers thin and logic reusable/testable.
9. **Why Redux if we have useState?** useState is local to one component; Redux shares data between pages.
10. **How do you prevent SQL injection?** Sequelize escapes values; raw queries use `replacements`.
11. **How do uploads work?** Multer saves the file on disk, DB stores the path, Express serves `/uploads`.
12. **How do cron jobs work?** `node-cron` schedules a function by a cron expression (`0 0 * * *` = daily at midnight) inside the running Node process.
13. **Why streams for CSV?** Data is sent chunk by chunk; the whole file is never held in memory.
14. **Why Vite and Webpack?** Both are bundlers. Vite is faster for development; Webpack is included as a syllabus demo.

## 11. What is NOT included (honest list)
Email/SMS sending, password reset, WebSockets (we poll), cloud image storage, automated unit tests for the React UI (a backend API smoke test is included: `npm test`), a real separate 1:1 profile table.
