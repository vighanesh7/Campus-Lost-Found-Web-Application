# ER Diagram

```mermaid
erDiagram
  USERS ||--o{ ITEMS : "reports (1:M)"
  CATEGORIES ||--o{ ITEMS : "classifies (1:M)"
  ITEMS ||--o{ ITEM_IMAGES : "has (1:M)"
  USERS ||--o{ NOTIFICATIONS : "receives (1:M)"
  USERS ||--o{ MESSAGES : "sends (1:M)"
  CONVERSATIONS ||--o{ MESSAGES : "contains (1:M)"
  USERS ||--o{ CONVERSATION_PARTICIPANTS : "joins"
  CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : "has"
  USERS ||--o{ FAVORITES : "saves"
  ITEMS ||--o{ FAVORITES : "saved as"
  ITEMS ||--o{ REPORTS : "complained about (1:M)"
  USERS ||--o{ REPORTS : "files (1:M)"
  ITEMS ||--o{ ITEM_MATCHES : "lostItemId"
  ITEMS ||--o{ ITEM_MATCHES : "foundItemId"
  USERS ||--o{ AUDIT_LOGS : "performs (1:M)"
  ITEMS ||--o{ CONVERSATIONS : "topic of (optional)"
  USERS { int id PK string email UK string studentId UK string password enum role }
  CATEGORIES { int id PK string name UK }
  ITEMS { int id PK int userId FK int categoryId FK enum type enum status date date }
  ITEM_IMAGES { int id PK int itemId FK string imagePath bool isPrimary }
  FAVORITES { int id PK int userId FK int itemId FK }
  CONVERSATIONS { int id PK int itemId FK }
  CONVERSATION_PARTICIPANTS { int id PK int conversationId FK int userId FK }
  MESSAGES { int id PK int conversationId FK int senderId FK text message datetime readAt }
  NOTIFICATIONS { int id PK int userId FK enum type bool isRead int relatedItemId FK }
  REPORTS { int id PK int itemId FK int reportedBy FK enum status text adminNotes }
  ITEM_MATCHES { int id PK int lostItemId FK int foundItemId FK int score }
  AUDIT_LOGS { int id PK int userId FK string action string entity }
```

## Relationship types
| Type | Relationship | Sequelize | Join table |
|---|---|---|---|
| **1:1** | User - Profile *(profile fields are inside `users`; `hasOne` would be used if split)* | `hasOne` / `belongsTo` | - |
| **1:M** | User -> Items, Category -> Items, Item -> ItemImages, User -> Notifications, User -> Messages, Conversation -> Messages, Item -> Reports, User -> Reports, User -> AuditLogs | `hasMany` / `belongsTo` | - |
| **M:N** | Users <-> Conversations | `belongsToMany` | `conversation_participants` |
| **M:N** | Users <-> Items (favourites) | `belongsToMany` | `favorites` (unique userId+itemId) |
| **M:N** | Items <-> Items (possible matches, lost<->found) | `belongsToMany` (self) | `item_matches` |

All associations are defined in `backend/src/models/index.js`.
