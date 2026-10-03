# Database Schema (MySQL `campus_lost_found`)

Created by `backend/migrations/*` (12 files, run in timestamp order). Plain SQL copy: `database/schema.sql`.

| Table | Purpose | Key columns | Foreign keys (on delete) |
|---|---|---|---|
| `users` | Accounts | id, name, email (UK), password (bcrypt hash), studentId (UK), department, year, phone, profileImage, role STUDENT/ADMIN | - |
| `categories` | Item categories | id, name (UK), description | - |
| `items` | Lost/found posts | id, type LOST/FOUND, name, description, location, date, time, status, image, additionalDetails, contactPreference | userId -> users (CASCADE), categoryId -> categories (RESTRICT) |
| `item_images` | Extra images per item | id, imagePath, isPrimary | itemId -> items (CASCADE) |
| `favorites` | Saved items | id, createdAt, UK(userId,itemId) | userId, itemId (CASCADE) |
| `conversations` | Chat threads | id, itemId (optional topic) | itemId -> items (SET NULL) |
| `conversation_participants` | Users in a thread | UK(conversationId,userId) | conversationId, userId (CASCADE) |
| `messages` | Chat messages | id, message, readAt, createdAt | conversationId, senderId (CASCADE) |
| `notifications` | In-app alerts | type, title, message, isRead | userId (CASCADE), relatedItemId (SET NULL) |
| `reports` | Complaints about a post | reportType, reason, status PENDING/REVIEWED/APPROVED/REJECTED/RESOLVED, adminNotes | itemId, reportedBy (CASCADE) |
| `audit_logs` | Admin action history | action, entity, entityId, details | userId (SET NULL) |
| `item_matches` | Suggested lost<->found pairs | score, UK(lostItemId,foundItemId) | lostItemId, foundItemId (CASCADE) |

## Enums
- `items.status`: ACTIVE, PENDING, MATCHED, RETURNED, RESOLVED, CLOSED
- `notifications.type`: ITEM_REPORTED, MATCH_FOUND, MESSAGE, STATUS_CHANGE, ITEM_RESOLVED, ADMIN_ACTION, REMINDER

## Indexes
`items(type,status)`, `items(categoryId)`, `items(location)` speed up the search/filter queries.

## Mapping model -> table
User->users, Category->categories, Item->items, ItemImage->item_images, Favorite->favorites, Conversation->conversations, ConversationParticipant->conversation_participants, Message->messages, Notification->notifications, Report->reports, AuditLog->audit_logs, ItemMatch->item_matches.

## Raw SQL used (src/queries/statsQueries.js)
Totals (COUNT + SUM(CASE)), user pending count, top categories (JOIN + GROUP BY), common lost locations, reports per month (DATE_FORMAT), report counts by status.
