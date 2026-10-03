# API Documentation

Base URL: `http://localhost:5000/api` · Format: JSON (uploads use `multipart/form-data`)
Auth: header `Authorization: Bearer <token>` where marked **Auth**.

Success: `{ "success": true, "message": "...", "data": { } }`
Error: `{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Valid email is required" }] }`

Common errors: **400** bad request · **401** missing/invalid token · **403** not allowed · **404** not found · **409** duplicate · **422** validation failed · **500** server error.

---
## Health
`GET /health` - no auth. `data.time`.

## Auth
| Method & URL | Auth | Body | Response | Errors |
|---|---|---|---|---|
| `POST /auth/register` | no | name, email, password (>=8), confirmPassword, studentId, department, year (1-6), phone | 201 `{ user, token }` | 422, 409 (email/studentId used) |
| `POST /auth/login` | no | email, password | `{ user, token }` | 422, 401 |
| `GET /auth/me` | **yes** | - | `{ user }` | 401 |
| `POST /auth/logout` | **yes** | - | `{}` (client deletes token) | 401 |

## Items
| Method & URL | Auth | Details |
|---|---|---|
| `GET /items` | yes | Query: `search, type (lost/found), category (name), categoryId, location, status, date, dateFrom, dateTo, page=1, limit=12 (max 50)`. Returns `{ items, currentPage, totalPages, totalItems }`. Filters combine: `/items?type=lost&category=electronics&location=library` |
| `GET /items/mine` | yes | Same query as above, only my items |
| `GET /items/stats` | yes | `{ total, lost, found, resolved, pending }` (raw SQL) |
| `GET /items/:id` | yes | `{ item }` with category, reporter (id, name, department), images. 404 if missing |
| `POST /items` | yes | multipart: `type (LOST/FOUND), name, categoryId, description (10-2000), location, date (not future), time (HH:MM, optional), contactPreference (MESSAGE/EMAIL/PHONE), additionalDetails, image (jpg/png/webp <=5MB)`. 201 `{ item }`. 422 on invalid |
| `PUT /items/:id` | owner/admin | same fields, all optional. 403 otherwise |
| `PATCH /items/:id/status` | owner/admin | `{ "status": "RESOLVED" }`. Owners: ACTIVE, RETURNED, RESOLVED, CLOSED. Admin: any. 403 otherwise |
| `DELETE /items/:id` | owner/admin | removes item + image files |

Example `POST /items`: `type=LOST, name=iPhone 13 Pro, categoryId=1, description=Black iPhone with a transparent case., location=Library, date=2026-10-02`

## Categories
| `GET /categories` | none (public read) | `{ categories }` |
|---|---|---|
| `POST /categories` | admin | `{ name, description }` -> 201 |
| `PUT /categories/:id` | admin | `{ name, description }` |
| `DELETE /categories/:id` | admin | 400 if items still use it |

## Users
| `GET /users/profile` | yes | `{ user, stats: { lost, found, resolved } }` |
|---|---|---|
| `PUT /users/profile` | yes | multipart: name, department, year, phone, profileImage |
| `GET /users/:id` | yes | public info (id, name, department, profileImage) |

## Favorites
`GET /favorites` -> `{ favorites: [{ id, itemId, item }] }` · `POST /favorites/:itemId` (201, idempotent, 404 if item missing) · `DELETE /favorites/:itemId` (404 if not saved). All **Auth**.

## Messages (Auth)
| `GET /messages` | `{ conversations: [{ id, item, other, lastMessage, unreadCount }] }` |
|---|---|
| `GET /messages/:conversationId` | `{ conversation, messages }`; marks incoming as read; 404 if not a participant |
| `POST /messages` | `{ message, conversationId? , recipientId?, itemId? }` - give `conversationId` to reply, or `recipientId` (+`itemId`) to start. 201 `{ message, conversationId }` |
| `PUT /messages/:id/read` | sets `readAt` on a message sent to me |

## Notifications (Auth)
`GET /notifications` -> `{ today, earlier, unreadCount }` · `PUT /notifications/:id/read` · `PUT /notifications/read-all`.

## Reports (complaints about a post) (Auth)
| `GET /reports` | students: own reports; admin: all. Query `status, page, limit` |
|---|---|
| `POST /reports` | `{ itemId, reportType (INAPPROPRIATE/SPAM/DUPLICATE/FALSE_CLAIM/OTHER), reason (5-1000) }` -> 201; 409 if a pending one exists |
| `PATCH /reports/:id` | **admin** `{ status, adminNotes }`; APPROVED closes the item and notifies users |

## Matches (Auth)
`GET /matches/item/:id` - possible matches (with `score`) for an item you own (or admin).

## Admin (all **admin only**, otherwise 403)
| `GET /admin/stats` | totals, users, reportCounts, topCategories, commonLocations, reportsPerMonth, recentReports |
|---|---|
| `GET /admin/users?search&page&limit` | paginated users |
| `PUT /admin/users/:id/role` | `{ role: STUDENT/ADMIN }` (not yourself) |
| `DELETE /admin/users/:id` | not yourself |
| `GET /admin/items` | same query as `/items` |
| `DELETE /admin/items/:id` | remove inappropriate content |
| `GET /admin/export/items` / `reports` | **streamed CSV download** |
