# MongoDB Database Design for NoteFlow

## 1. Key Naming Conventions

### Collection Names
- `users` - User accounts and authentication data
- `notes` - All user notes with embedded content
- `categories` - User-defined categories for note organization

### Document ID Pattern
- **Format**: MongoDB ObjectId (24-character hexadecimal string)
- **Example**: `507f1f77bcf86cd799439011`
- **Generation**: Automatic by MongoDB on document creation
- **Uniqueness**: Guaranteed by MongoDB across all collections

### Field Naming Conventions
- **Style**: camelCase throughout
- **Pattern**: `{entity}{Property}` (e.g., `userId`, `categoryId`, `vectorId`)
- **Timestamp Fields**: `createdAt`, `updatedAt` (ISO 8601 datetime strings)
- **Status Fields**: `aiAnalysisStatus` (enum: pending, completed, failed)
- **Array Fields**: Plural nouns (`tags`, `keywords`, `links`, `images`, `sharedWith`)
- **Embedded Objects**: Singular nouns (`content` with nested `text`, `links`, `images`)

### Index Naming Pattern
- **Format**: `{collection}_{field(s)}_{type}`
- **Examples**:
  - `users_username_unique` - Unique index on username
  - `notes_userId_createdAt_compound` - Compound index on userId and createdAt
  - `notes_content_text_text` - Text index on content.text
  - `notes_vectorId_sparse_unique` - Sparse unique index on vectorId

## 2. Data Structure Specifications

### 2.1 Users Collection

**Collection Name**: `users`

**Document Structure**:
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  username: String,                 // Unique, 3-50 chars, alphanumeric + underscore
  password: String,                 // Hashed with bcryptjs (never returned in API)
  createdAt: String,                // ISO 8601 datetime
  updatedAt: String                 // ISO 8601 datetime
}
```

**Indexes**:
- `users_username_unique`: Unique index on `username` field
- `users_createdAt_single`: Single index on `createdAt` for sorting

**Data Types**:
- `_id`: ObjectId (MongoDB default)
- `username`: String (required, unique, indexed)
- `password`: String (required, hashed, never exposed)
- `createdAt`: String (ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`)
- `updatedAt`: String (ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`)

**Constraints**:
- Username: 3-50 characters, pattern `^[a-zA-Z0-9_]+$`
- Password: Minimum 8 characters (hashed before storage)
- Username must be unique (enforced by unique index)

### 2.2 Notes Collection

**Collection Name**: `notes`

**Document Structure**:
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  userId: ObjectId,                 // Reference to users._id
  content: {                        // Embedded document
    text: String,                   // Note text content (max 2000 words)
    links: [String],                // Array of normalized URLs
    images: [{                      // Array of image metadata objects
      url: String,                  // Full cloud storage URL (S3/Cloudinary)
      filename: String,             // Original filename
      mimeType: String,            // MIME type (image/jpeg, image/png, etc.)
      size: Number,                 // File size in bytes
      uploadedAt: String           // ISO 8601 datetime
    }]
  },
  title: String,                    // First line of content (extracted at write time)
  categoryId: ObjectId | null,     // Reference to categories._id (nullable)
  categoryName: String | null,      // Denormalized category name (nullable)
  tags: [String],                   // Normalized tags (lowercase, trimmed, deduplicated)
  keywords: [String],              // AI-generated keywords
  vectorId: ObjectId | null,       // Reference to Qdrant vector (sparse, nullable)
  version: Number,                  // Optimistic concurrency control (starts at 1)
  aiAnalysisStatus: String,         // Enum: "pending" | "completed" | "failed"
  sharedWith: [{                    // Array of sharing relationships
    userId: ObjectId,              // User ID of recipient
    username: String,              // Denormalized username
    sharedAt: String              // ISO 8601 datetime
  }],
  createdAt: String,                // ISO 8601 datetime
  updatedAt: String                 // ISO 8601 datetime
}
```

**Indexes**:
- `notes_userId_createdAt_compound`: Compound index on `{userId: 1, createdAt: -1}` for chronological retrieval
- `notes_userId_categoryId_compound`: Compound index on `{userId: 1, categoryId: 1}` for category filtering
- `notes_userId_tags_compound`: Compound index on `{userId: 1, tags: 1}` for tag-based queries
- `notes_userId_aiAnalysisStatus_compound`: Compound index on `{userId: 1, aiAnalysisStatus: 1}` for status filtering
- `notes_vectorId_sparse_unique`: Sparse unique index on `vectorId` (null values not indexed)
- `notes_content_text_text`: Text index on `content.text` and `keywords` array for keyword search
- `notes_sharedWith_userId_multikey`: Automatic multikey index on `sharedWith.userId` for shared notes queries

**Data Types**:
- `_id`: ObjectId
- `userId`: ObjectId (required, indexed)
- `content.text`: String (required, UTF-8 encoded)
- `content.links`: Array of Strings (normalized URLs)
- `content.images`: Array of Objects (image metadata)
- `title`: String (extracted from first line of content)
- `categoryId`: ObjectId | null (indexed when not null)
- `categoryName`: String | null (denormalized for read performance)
- `tags`: Array of Strings (normalized: lowercase, trimmed, deduplicated)
- `keywords`: Array of Strings (AI-generated, indexed for text search)
- `vectorId`: ObjectId | null (sparse unique index)
- `version`: Number (integer, starts at 1, increments on update)
- `aiAnalysisStatus`: String (enum: "pending", "completed", "failed")
- `sharedWith`: Array of Objects (multikey indexed on userId)
- `createdAt`: String (ISO 8601)
- `updatedAt`: String (ISO 8601)

**Constraints**:
- Document size: Must stay under 16MB (target: <1MB per document)
- Text content: Maximum 2000 words (application-level validation)
- Version: Must increment on each update for optimistic concurrency control
- Tags: Normalized at write time (lowercase, trimmed, deduplicated)
- Links: Normalized at write time (absolute URLs, trailing slashes removed)

### 2.3 Categories Collection

**Collection Name**: `categories`

**Document Structure**:
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  userId: ObjectId,                 // Reference to users._id
  name: String,                     // Category name (1-100 chars, unique per user)
  noteCount: Number,                 // Denormalized count (optional, for queries with includeCounts)
  createdAt: String,                 // ISO 8601 datetime
  updatedAt: String                  // ISO 8601 datetime
}
```

**Indexes**:
- `categories_userId_name_compound`: Compound unique index on `{userId: 1, name: 1}` (case-insensitive uniqueness enforced at application level)
- `categories_userId_single`: Single index on `userId` for user's category queries

**Data Types**:
- `_id`: ObjectId
- `userId`: ObjectId (required, indexed)
- `name`: String (required, 1-100 characters)
- `noteCount`: Number (optional, calculated on demand or cached)
- `createdAt`: String (ISO 8601)
- `updatedAt`: String (ISO 8601)

**Constraints**:
- Category name: 1-100 characters
- Category name must be unique per user (case-insensitive, enforced at application level)
- When category deleted, all notes with this categoryId have categoryId set to null

## 3. TTL and Expiration Policies

### 3.1 Document-Level TTL
- **No TTL Indexes**: NoteFlow uses hard deletes instead of TTL for data management
- **Rationale**: Hard deletes provide explicit control and simplify data model
- **Cleanup**: Application-level cleanup when notes/categories are deleted

### 3.2 Session Data TTL
- **Storage**: All session data stored in Redis, not MongoDB
- **TTL**: 24 hours default (configurable)
- **Rationale**: Leverages Redis TTL capabilities and reduces MongoDB load

### 3.3 Cache TTL (Application Layer)
- **Note Lists**: 5 minutes TTL in Redis
- **Category Lists**: 10 minutes TTL in Redis
- **Individual Notes**: 1 minute TTL in Redis
- **Cache Invalidation**: On note create/update/delete operations

### 3.4 Background Job Cleanup
- **Category Rename Updates**: Background job updates all affected notes when category renamed
- **Shared Note Cleanup**: Application-level cleanup removes deleted notes from sharedWith arrays
- **Orphaned Vector IDs**: Periodic cleanup job to identify and handle orphaned Qdrant vector references

## 4. Memory Optimization Strategy

### 4.1 Document Size Management
- **Target Average**: <500KB per note document
- **Maximum Document**: <1MB per note document
- **Alert Threshold**: 5MB (safety threshold before 16MB limit)
- **Size Calculation**: Includes text content, embedded arrays, metadata, and all nested objects

### 4.2 Data Compression Techniques
- **Embedded Document Structure**: Reduces query overhead by storing related data together
- **Efficient Field Naming**: Short, descriptive camelCase names (e.g., `userId` vs `userIdentifier`)
- **Array Optimization**: Efficient storage of keywords, tags, and links as embedded arrays
- **Sparse Indexes**: Use sparse unique index on `vectorId` to save memory (null values not indexed)
- **UTF-8 Encoding**: Proper encoding ensures efficient storage of special characters, emojis, multi-byte characters

### 4.3 Index Memory Optimization
- **Selective Indexing**: Create indexes only on fields with good selectivity
- **Compound Indexes**: Optimize for common query patterns while managing memory usage
- **Sparse Indexes**: Use for optional fields (vectorId) to save memory
- **Text Index**: Single text index covering multiple fields (content.text, keywords) for efficient full-text search
- **Index Monitoring**: Track index size and drop unused indexes

### 4.4 Memory Usage Monitoring
- **WiredTiger Cache**: Monitor usage, alert when >80%
- **Index Memory**: Track compound index memory consumption
- **Document Size**: Alert when documents approach 10MB
- **Average Document Size**: Alert when >5MB
- **Index Size**: Alert when index size >50% of collection size

## 5. Performance Benchmarks

### 5.1 Query Performance Targets
- **Note Retrieval**: <500ms for single note by ID
- **Note List (Paginated)**: <500ms for 20 notes with cursor-based pagination
- **Category List**: <200ms for user's categories
- **Shared Notes Query**: <500ms for shared notes list
- **Keyword Search**: <1 second for text index queries
- **Category Filter**: <300ms for notes filtered by category
- **Date Range Query**: <500ms for date-based queries

### 5.2 Write Performance Targets
- **Note Creation**: <200ms for new note insertion
- **Note Update**: <300ms for partial updates using MongoDB operators
- **Category Creation**: <100ms for new category
- **Note Sharing**: <400ms including validation and array update
- **Bulk Category Rename**: <2 seconds per 1000 affected notes

### 5.3 Concurrent Operation Performance
- **Concurrent Reads**: Support 1000 concurrent users with <500ms response time
- **Concurrent Writes**: Handle concurrent note updates with optimistic locking
- **Transaction Performance**: <500ms for multi-document transactions (note + AI status update)

### 5.4 Memory Usage Estimates
- **Average Note Document**: ~50-200KB (depending on content length)
- **User Document**: ~200 bytes
- **Category Document**: ~150 bytes
- **Index Overhead**: ~30-40% of collection size
- **Total Estimated**: ~500MB for 10,000 notes per user (with indexes)

## 6. Session Management Design

### 6.1 Session Storage Strategy
- **Primary Storage**: Redis for all session data
- **MongoDB Role**: Only stores user authentication data (username, hashed password)
- **Session Data**: User ID, username, login timestamp stored in Redis with TTL
- **Rationale**: Leverages Redis TTL capabilities, reduces MongoDB load, faster session lookups

### 6.2 Session Isolation
- **User Isolation**: All queries filtered by userId to ensure data isolation
- **Index Strategy**: Compound indexes always include userId as first field
- **Query Pattern**: All note queries include `{userId: <userObjectId>}` filter

### 6.3 Session Cleanup
- **Automatic**: Redis TTL handles session expiration (24 hours default)
- **Manual**: Application-level logout invalidates Redis session
- **MongoDB**: No session cleanup needed (sessions not stored in MongoDB)

## 7. Configuration Recommendations

### 7.1 MongoDB Atlas Cluster Configuration
- **Instance Type**: M10 (2GB RAM) for MVP, scale to M20 (4GB RAM) as needed
- **Storage**: 10GB minimum, auto-scaling enabled
- **Replica Set**: 3-node replica set for high availability
- **Region**: Single region deployment for MVP (lowest latency)

### 7.2 Connection Pooling (Prisma)
- **Min Connections**: 5
- **Max Connections**: 20
- **Connection Timeout**: 30 seconds
- **Idle Timeout**: 10 minutes
- **Max Lifetime**: 1 hour

### 7.3 Write Concern Configuration
- **Default**: `{w: 1}` (acknowledge write to primary)
- **Critical Operations**: `{w: "majority"}` for note creation and sharing
- **Non-Critical**: `{w: 1}` for category updates and metadata changes

### 7.4 Read Preference
- **Default**: `primary` (read from primary for consistency)
- **Analytics Queries**: `secondaryPreferred` (future optimization for read-heavy analytics)

### 7.5 Transaction Configuration
- **Timeout**: 30 seconds default
- **Max Retries**: 3 attempts for transient failures
- **Use Cases**: 
  - Note creation with AI analysis status update
  - Category rename with note updates
  - Note sharing with validation

### 7.6 Index Configuration
- **Background Index Building**: Use background index creation for large collections
- **Index Maintenance**: Monitor and drop unused indexes monthly
- **Index Rebuild**: Rebuild indexes if fragmentation >30%

## 8. Error Handling Patterns

### 8.1 Connection Failure Handling
- **Retry Strategy**: Exponential backoff (1s, 2s, 4s, 8s)
- **Max Retries**: 3 attempts for transient failures
- **Circuit Breaker**: Stop retrying after 3 consecutive failures, wait 60 seconds
- **Fallback**: Return 503 Service Unavailable to client

### 8.2 Transaction Failure Handling
- **Optimistic Locking Conflicts**: Return 409 Conflict with current version number
- **Deadlock Detection**: Retry transaction with exponential backoff
- **Timeout Handling**: Return 408 Request Timeout, allow client retry
- **Partial Updates**: Use MongoDB update operators to prevent partial writes

### 8.3 Data Consistency Strategies
- **Unique Constraint Violations**: 
  - Username conflicts: Return 409 Conflict with clear error message
  - Vector ID conflicts: Log error, regenerate vector ID, retry
- **Referential Integrity**:
  - Category deletion: Set categoryId to null in all affected notes
  - Note deletion: Remove from all sharedWith arrays (application-level cleanup)
  - User deletion: Not supported in MVP (cascade delete out of scope)

### 8.4 Document Size Validation
- **Pre-Write Validation**: Check document size before write (application-level)
- **Post-Write Validation**: Monitor document sizes, alert if >5MB
- **Size Limit Enforcement**: 16MB hard limit enforced by MongoDB

### 8.5 Index Performance Issues
- **Slow Query Detection**: Log queries >500ms
- **Missing Index Alerts**: Monitor query patterns, identify missing indexes
- **Index Fragmentation**: Rebuild indexes if query performance degrades

## 9. Monitoring and Metrics

### 9.1 Key Performance Indicators (KPIs)

#### Query Performance Metrics
- **Average Query Time**: Target <500ms
- **P95 Query Time**: Target <1 second
- **P99 Query Time**: Target <2 seconds
- **Slow Query Count**: Alert if >10 slow queries per minute
- **Query Throughput**: Track queries per second

#### Index Performance Metrics
- **Index Hit Rate**: Target >95%
- **Index Usage Statistics**: Track which indexes are used
- **Index Size**: Monitor index memory consumption
- **Missing Index Alerts**: Identify queries that could benefit from indexes

#### Document Metrics
- **Average Document Size**: Target <500KB
- **Maximum Document Size**: Alert if >5MB
- **Document Count**: Track total documents per collection
- **Document Growth Rate**: Monitor collection growth

#### Connection Metrics
- **Active Connections**: Monitor connection pool usage
- **Connection Wait Time**: Alert if connections waiting >1 second
- **Connection Errors**: Track connection failure rate
- **Connection Pool Utilization**: Target 60-80% utilization

#### Write Performance Metrics
- **Write Latency**: Target <300ms for writes
- **Write Throughput**: Track writes per second
- **Transaction Success Rate**: Target >99%
- **Optimistic Lock Conflicts**: Track 409 Conflict rate

### 9.2 MongoDB Atlas Monitoring
- **WiredTiger Cache Usage**: Alert if >80%
- **Disk I/O**: Monitor read/write operations
- **CPU Usage**: Alert if >80% sustained
- **Memory Usage**: Track WiredTiger cache and index memory
- **Replication Lag**: Monitor replica set lag (target <1 second)

### 9.3 Application-Level Monitoring
- **Query Execution Time**: Log all queries >500ms
- **Cache Hit/Miss Ratios**: Track Redis cache performance
- **Error Rates**: Track 4xx and 5xx error rates
- **API Response Times**: Track end-to-end response times

### 9.4 Alert Thresholds
- **Critical Alerts**:
  - WiredTiger cache usage >90%
  - Average query time >1 second
  - Document size >10MB
  - Connection pool exhaustion
  - Replication lag >5 seconds

- **Warning Alerts**:
  - WiredTiger cache usage >80%
  - Average query time >500ms
  - Document size >5MB
  - Index size >50% of collection
  - Slow query count >10 per minute

### 9.5 Monitoring Tools
- **MongoDB Atlas Monitoring**: Built-in performance monitoring and alerting
- **Application Logging**: Winston structured logging for query performance
- **Custom Metrics**: Application-level metrics for business logic performance
- **Dashboard**: MongoDB Atlas dashboard for real-time monitoring

## 10. Implementation Readiness Checklist

### Data Model
- [x] Collection structures defined
- [x] Field types and constraints specified
- [x] Index strategy documented
- [x] Naming conventions established

### Performance
- [x] Query performance targets defined
- [x] Index strategy optimized for query patterns
- [x] Connection pooling configured
- [x] Write concern strategy defined

### Reliability
- [x] Error handling patterns documented
- [x] Transaction strategy defined
- [x] Data consistency patterns established
- [x] Backup and recovery strategy (MongoDB Atlas managed)

### Monitoring
- [x] KPIs defined
- [x] Alert thresholds configured
- [x] Monitoring tools identified
- [x] Performance benchmarks established

### Security
- [x] Authentication strategy defined
- [x] Network security configured
- [x] Encryption at rest and in transit
- [x] Field-level security (password never exposed)

This database design is implementation-ready and provides clear guidance for developers to build a high-performance MongoDB application for NoteFlow.

