# CSA-301 Syllabus Mapping

Each row: topic -> where it is in the project -> what to say in the viva.

## Node.js / Backend
| Week | Topic | Implementation | Explain |
|---|---|---|---|
| 1 | Node installation, REPL, folder structure, package.json, Express server | `backend/package.json`, `server.js`, `src/app.js` | Run `node` for REPL. `package.json` lists dependencies and scripts. `server.js` boots DB + starts Express listening on a port. |
| 2 | Modules, dependencies, module functionality | Every file uses `require` / `module.exports`; layers `routes -> controllers -> services -> models` | Each file has one job and exports it; npm packages are dependencies. |
| 3 | Event loop, concurrency, async coding, callbacks, exceptions | `utils/asyncExamples.js`; all services use `async/await` + `try/catch` via `asyncHandler` | Blocking call freezes the loop; async hands work to the OS and continues, so many requests run concurrently. Callback demo: `callbackRead`. |
| 4 | Promises, chaining, File System | `asyncExamples.js` (`.then().catch()`), `utils/fileUtils.js` (`fs/promises`: mkdir, unlink, appendFile) | Upload folder creation, log file writing, deleting images use non-blocking fs. |
| 5 | Event Emitters, server routes, request headers, streams, gateway | `events/`, `routes/*`, `requestLogger.js` + `authMiddleware.js` (headers), `utils/csvStream.js`, `routes/apiGateway.js` | `itemReported` event -> notification + matching. CSV export pipes a Readable into the HTTP response Writable. Gateway mounts all modules under `/api`. |
| 5 | Standard streams, command-line arguments | `utils/streamExamples.js` (stdout), `server.js --port=`, `utils/cli.js` | `process.argv`, `process.stdout`. |
| 6 | Cron jobs, blocking vs non-blocking, Webpack | `jobs/staleReportsJob.js`, `asyncExamples.js`, `webpack-demo/` | Cron `0 0 * * *`. Webpack bundles modules from an entry to an output; the real app uses Vite. |

## Sequelize / MySQL
| Week | Topic | Implementation | Explain |
|---|---|---|---|
| 7 | Sequelize + MySQL connection | `src/config/config.js`, `src/models/index.js`, `server.js` (`sequelize.authenticate()`) | Credentials from `.env`; one `Sequelize` instance shared by all models. |
| 8 | Models + migrations | `src/models/*.js` (12), `migrations/*.js` (12), `seeders/*` | Model = table class; migration = versioned schema change with `up`/`down`; commands `db:migrate`, `db:seed:all`. |
| 9 | Finders, validation, raw queries | `findAll, findOne, findByPk, findAndCountAll, findOrCreate, create, update, destroy, count` in services; `validators/`; model validations (`isEmail`, `len`); `queries/statsQueries.js` | Search uses `where + Op.like + include + order + limit + offset`. Raw SQL with `replacements` for aggregates. |
| 10 | Associations 1:1, 1:M, M:N | `models/index.js`; `docs/ER_DIAGRAM.md` | `hasMany/belongsTo` (User-Items), `belongsToMany` through `favorites`, `conversation_participants`, `item_matches`; `hasOne` explained for a split profile. |

## React
| Week | Topic | Implementation |
|---|---|---|
| 11 | Components, props, state | `components/` (ItemCard gets `item`, `onFavorite`, `onView`), pages, `useState` in forms/filters |
| 12 | Hooks | `useState, useEffect, useReducer (ReportItem), useRef, useMemo, useCallback, useContext (ToastContext)`, custom hooks `useDebounce`, `useCategories`, `useItemActions` |
| 13 | Routes / navigation | `App.jsx` (Routes, nested layout routes), `ProtectedRoute`, `NavLink`, `useParams`, `useNavigate`, `useSearchParams` |
| 14 | Redux + dispatch | `redux/store.js`, 5 slices, `createAsyncThunk`, `dispatch(loginUser())`, `useSelector` |
| 15 | React + Node integration | `services/api.js` (Axios + interceptors), thunks -> REST API -> Sequelize -> MySQL -> Redux -> UI |

## Flow to describe (Report a lost item)
`ReportItem form` -> `dispatch(createItem(formData))` -> Axios `POST /api/items` (+ JWT header) -> `authMiddleware` -> Multer saves image -> validators -> `itemController.create` -> `itemService.create` -> `Item.create()` (MySQL INSERT) -> emit `itemReported` -> listener creates notification + `matchingService` -> JSON response -> Redux store -> navigate to `/items/:id`.
