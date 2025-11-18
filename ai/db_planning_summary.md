# MongoDB Database Planning Summary

<conversation_summary>
<decisions>
1. Use embedded documents for note content (text, links, images) to minimize queries and improve performance
2. Implement separate users collection with unique index on username for authentication and user management
3. Create compound indexes on userId + createdAt for efficient chronological note retrieval and pagination
4. Store categories as separate documents with user references for efficient category management
5. Use embedded arrays for note sharing relationships (sharedWith) within note documents with userId and username
6. Use embedded arrays for AI-generated keywords and tags within note documents for optimal read performance
7. Implement hard deletes for notes to simplify data model and reduce storage overhead
8. Store image metadata as embedded objects within note documents with full cloud storage URLs (S3/Cloudinary)
9. Create compound indexes: {userId: 1, createdAt: -1}, {userId: 1, categoryId: 1}, {userId: 1, tags: 1}, {userId: 1, aiAnalysisStatus: 1} for efficient querying
10. Create sparse unique index on vectorId field to maintain referential integrity with Qdrant
11. Create text index on note content text field and keywords array for keyword-based searches
12. No data partitioning or sharding strategies for MVP simplicity
13. Store Qdrant vector IDs as a field in note documents (not as document ID) to maintain referential integrity
14. Use separate timestamp fields (createdAt, updatedAt) with application-level generation for better query performance
15. Rely on application-level validation with Prisma for the 2000-word limit, with 16MB document limit as safety net
16. Implement optimistic concurrency control using incrementing version number field starting at 1
17. Use MongoDB transactions for atomic updates when modifying note content and AI analysis status simultaneously
18. Denormalize categoryName in note documents for read performance, with background job to update affected notes on category rename
19. Normalize tags at write time (lowercase, trimmed, deduplicated) and store in tags array
20. Validate and normalize URLs at write time and store normalized URLs in links array
21. Extract and store first line of note content as separate title field at write time for efficient preview generation
22. Set categoryId to null and remove categoryName when category is deleted, with application-level cleanup
23. When note is deleted, automatically remove from all sharedWith arrays through application-level cleanup
24. Implement both database-level unique index on username and application-level validation
25. Use MongoDB's update operators ($set, $push, $pull) for efficient partial updates without rewriting entire documents
26. Ensure UTF-8 encoding for all text fields with proper collation settings for text indexes
27. Store only vectorId reference in MongoDB, relying entirely on Qdrant for vector storage and semantic search
28. Rely entirely on Redis for session management, storing only user authentication data in MongoDB
29. Skip analytics, audit logs, search history, and access pattern tracking for MVP scope
30. No database-level caching strategies, rely on Redis for all caching needs
31. Use cursor-based pagination using createdAt timestamps for handling large note collections
32. No automatic archival needed for MVP scope
33. Design note content structure to stay well under MongoDB's 16MB limit
</decisions>

<matched_recommendations>
1. Store sharedWith as embedded arrays with userId and username for efficient reads, with application-level validation for username consistency
2. Create sparse unique index on vectorId field to support efficient lookups and maintain referential integrity with Qdrant
3. Embed AI analysis status directly in note documents using aiAnalysisStatus field to minimize queries and support efficient filtering
4. Denormalize categoryName in note documents for read performance, with background job to update all affected notes when category is renamed
5. Store full cloud storage URLs (S3/Cloudinary) in image metadata objects within note documents for direct access
6. Normalize tags at write time (lowercase, trimmed, deduplicated) and store in tags array to ensure consistent searching
7. Create compound index on sharedWith.userId for efficient shared notes queries (MongoDB automatically creates multikey indexes for arrays)
8. Use simple incrementing version number field for optimistic concurrency control, starting at 1 and incrementing on each update
9. Store note content text as single string field with UTF-8 encoding, ensuring total document size stays well under 16MB
10. Create text index on note content text field and keywords array to support efficient keyword-based searches
11. Keep AI analysis status and results embedded in note documents for optimal read performance
12. Rely on cursor-based pagination using createdAt timestamps for handling large note collections
13. Validate and normalize URLs at write time and store normalized URLs in links array to ensure consistency
14. Use MongoDB transactions for atomic updates when modifying note content and AI analysis status simultaneously
15. Extract and store first line of note content as separate title field at write time for efficient preview generation
16. Create compound indexes: {userId: 1, createdAt: -1} for date queries, {userId: 1, categoryId: 1} for category filtering, text index for keyword search
17. Rely on application-level validation for 2000-word limit with database-level size constraints as safety net
18. Set categoryId to null and remove categoryName when category is deleted, with application-level cleanup
19. Create compound index on {userId: 1, aiAnalysisStatus: 1} to support efficient queries for notes with specific analysis status
20. Use MongoDB's update operators ($set, $push, $pull) for efficient partial updates without rewriting entire documents
21. Ensure MongoDB uses UTF-8 encoding for all text fields with proper collation settings for text indexes
22. Store only vectorId reference in MongoDB note documents, relying entirely on Qdrant for vector storage
23. Rely entirely on Redis for session management to leverage TTL capabilities and reduce MongoDB load
</matched_recommendations>

<MongoDB_planning_summary>
### MongoDB Data Structures Chosen
- **Embedded Documents**: Note content (text, links, images) stored as embedded documents within note documents for optimal read performance and minimal query overhead
- **Separate Collections**: 
  - `users` collection for authentication and user management
  - `notes` collection for all user notes with embedded content
  - `categories` collection for user-defined categories with user references
- **Embedded Arrays**: 
  - AI-generated keywords stored as array of strings
  - User-defined tags stored as normalized array of strings
  - Sharing relationships (sharedWith) stored as array of objects with userId and username
- **Embedded Objects**: 
  - Image metadata stored as objects with url, filename, mimeType, size, uploadedAt fields
  - Note content structure with text, links array, and images array
- **Scalar Fields**: 
  - Timestamps (createdAt, updatedAt) as ISO 8601 datetime strings
  - Version number for optimistic concurrency control
  - vectorId reference to Qdrant for semantic search integration
  - aiAnalysisStatus enum field (pending, completed, failed)

### Key Naming Conventions and Patterns
- **Collection Names**: 
  - `users` - user accounts and authentication
  - `notes` - all user notes with embedded content
  - `categories` - user-defined categories
- **Document IDs**: MongoDB ObjectId (24-character hex string) for all documents
- **Field Naming**: camelCase convention throughout (userId, createdAt, updatedAt, categoryId, vectorId, aiAnalysisStatus)
- **Index Names**: Descriptive names following pattern `{collection}_{field(s)}_{type}` (e.g., `notes_userId_createdAt_compound`, `users_username_unique`)
- **Array Field Naming**: Plural nouns (tags, keywords, links, images, sharedWith)
- **Embedded Object Naming**: Singular nouns (content with nested text, links, images)

### Caching Strategies
- **Cache-Aside Pattern**: Application-level caching with Redis for frequently accessed data
- **No Write-Through Caching**: Direct writes to MongoDB without cache write-through
- **No Write-Behind Caching**: Synchronous writes to MongoDB for data consistency
- **Session Caching**: All session data stored in Redis with TTL, no MongoDB session storage
- **Query Result Caching**: Application-level caching of note lists and category lists in Redis
- **No Database-Level Caching**: MongoDB built-in query result caching disabled, all caching handled by Redis layer
- **Cache Invalidation**: Invalidate Redis cache on note create/update/delete operations

### Memory Management and Optimization Approaches
- **Embedded Document Strategy**: Reduces query overhead and improves read performance by minimizing separate collection queries
- **Compound Indexing**: Optimized for common query patterns (userId + createdAt, userId + categoryId, userId + aiAnalysisStatus) to reduce memory usage while maintaining query performance
- **Hard Deletes**: Simplified data model without soft delete overhead, reducing storage and memory requirements
- **Document Size Management**: Structured content organization ensures documents stay well under 16MB limit (target: <1MB per document)
- **Efficient Field Naming**: Short, descriptive camelCase field names to minimize document size
- **Array Optimization**: Efficient storage of keywords, tags, and links as embedded arrays with automatic multikey indexing
- **Sparse Indexes**: Use sparse unique index on vectorId to save memory for notes without vector embeddings
- **Text Index Optimization**: Single text index on content.text and keywords array for efficient full-text search

### Persistence Configuration
- **MongoDB Atlas Managed Persistence**: Use MongoDB Atlas default persistence settings
- **Replica Set Configuration**: MongoDB Atlas replica set for high availability and automatic failover
- **Journaling**: Enabled by default in MongoDB Atlas for durability
- **Write Concern**: Default write concern (w: 1) for MVP, can be adjusted for specific operations requiring higher durability
- **Read Preference**: Primary preferred for consistency, with option for secondary reads for analytics (future)
- **Backup Strategy**: MongoDB Atlas automated daily backups with point-in-time recovery
- **No Custom RDB/AOF Configuration**: Rely on MongoDB Atlas managed persistence mechanisms

### Clustering and Replication Requirements
- **No Sharding**: Single collection approach for MVP simplicity, no horizontal sharding required
- **Replica Set**: MongoDB Atlas replica set configuration (minimum 3 nodes) for high availability
- **No Custom Clustering**: Managed MongoDB Atlas cluster configuration, no manual cluster setup
- **Read Replicas**: Utilize secondary nodes for read scaling if needed (future optimization)
- **Geographic Distribution**: Single region deployment for MVP, multi-region replication for future scaling

### Security Configurations
- **Authentication**: MongoDB Atlas authentication with username/password credentials
- **Database User Roles**: Application user with read/write permissions on specific database, no admin privileges
- **Network Security**: 
  - VPC peering or IP whitelisting through MongoDB Atlas
  - Private endpoint connections for production environments
- **TLS Encryption**: MongoDB Atlas managed TLS encryption for all connections (TLS 1.2+)
- **Data Encryption at Rest**: MongoDB Atlas managed encryption at rest
- **Application-Level Security**: 
  - Prisma ORM with input validation and sanitization
  - JWT token-based authentication
  - Password hashing with bcryptjs
- **Field-Level Security**: Application-level field filtering to prevent password exposure in API responses
- **Connection String Security**: Environment variable storage for connection strings, never committed to version control

### Performance and Monitoring Considerations
- **Index Optimization**: 
  - Compound indexes for efficient querying patterns: {userId: 1, createdAt: -1}, {userId: 1, categoryId: 1}, {userId: 1, tags: 1}, {userId: 1, aiAnalysisStatus: 1}
  - Unique index on users.username for fast authentication lookups
  - Sparse unique index on notes.vectorId for Qdrant integration
  - Text index on notes.content.text and notes.keywords for keyword search
- **Query Performance Targets**: 
  - Sub-500ms for note retrieval operations
  - Sub-2 seconds for API response times
  - Sub-1 minute for semantic search operations (handled by Qdrant)
- **Pagination Strategy**: Cursor-based pagination using createdAt timestamps with time period splitting for large datasets
- **Connection Pooling**: Prisma connection pooling configured for optimal concurrent request handling
- **Monitoring**: 
  - MongoDB Atlas built-in monitoring and alerting
  - Query performance metrics tracking
  - Index usage statistics
  - Document size monitoring
  - Connection pool metrics
- **Performance Optimization**: 
  - Projection queries to fetch only required fields
  - Efficient update operations using MongoDB update operators
  - Batch operations for bulk updates (category renames)
</MongoDB_planning_summary>

<memory_optimization_strategy>
### Data Compression Techniques
- **Embedded Document Structure**: Reduces document overhead and improves memory efficiency by minimizing separate collection queries
- **Efficient Field Naming**: Short, descriptive camelCase field names (userId vs userIdentifier) to minimize document size
- **Array Optimization**: Efficient storage of keywords, tags, and links as embedded arrays with automatic multikey indexing
- **Sparse Indexes**: Use sparse unique index on vectorId to save memory for notes without vector embeddings (null values not indexed)
- **Document Structure**: Well-organized nested structure minimizes redundant data storage
- **UTF-8 Encoding**: Proper encoding ensures efficient storage of special characters, emojis, and multi-byte characters

### TTL (Time To Live) Policies
- **No TTL on Documents**: Hard deletes used instead of TTL for data management, no automatic document expiration
- **Session TTL**: Handled by Redis layer for session management with configurable TTL (default: 24 hours)
- **Cache TTL**: Managed by application layer with Redis, configurable per data type:
  - Note lists: 5 minutes
  - Category lists: 10 minutes
  - Individual notes: 1 minute
- **No MongoDB TTL Indexes**: All TTL functionality handled at application layer with Redis

### Memory Usage Monitoring
- **MongoDB Atlas Monitoring**: Built-in memory usage tracking and alerting for:
  - WiredTiger cache usage
  - Index memory consumption
  - Connection memory usage
  - Query execution memory
- **Application-Level Monitoring**: Custom metrics for:
  - Average document size per collection
  - Query execution time
  - Index hit rates
  - Cache hit/miss ratios
- **Index Memory Usage**: Monitor compound index memory consumption and optimize if needed
- **Document Size Tracking**: Alert when documents approach 10MB (safety threshold before 16MB limit)
- **Memory Alerts**: Configure alerts for:
  - WiredTiger cache usage > 80%
  - Average document size > 5MB
  - Index size > 50% of collection size

### Eviction Policies
- **MongoDB Default Eviction**: Use MongoDB Atlas managed eviction policies for WiredTiger cache
- **WiredTiger Cache Eviction**: Automatic eviction when cache approaches configured limit
- **No Custom Eviction**: Rely on MongoDB Atlas automatic memory management
- **Application-Level Cleanup**: Hard deletes for data cleanup instead of eviction
- **Index Eviction**: MongoDB automatically manages index memory, no manual intervention needed

### Data Structure Efficiency Considerations
- **Embedded Documents**: Minimize query overhead and improve read performance by storing related data together
- **Compound Indexes**: Optimize for common query patterns while managing memory usage through selective indexing
- **Document Size Management**: Stay well under 16MB limit with efficient field organization:
  - Average note document target: <500KB
  - Maximum note document: <1MB
  - Large document alert threshold: 5MB
- **Array Storage**: Efficient storage of keywords, tags, and links as embedded arrays with automatic multikey indexing
- **Sparse Indexes**: Use sparse indexes for optional fields (vectorId) to save memory
- **Text Index Optimization**: Single text index covering multiple fields (content.text, keywords) for efficient full-text search
- **Index Selectivity**: Create indexes only on fields with good selectivity to minimize index size
</memory_optimization_strategy>

<unresolved_issues>
1. Specific MongoDB Atlas cluster configuration details (instance size, storage capacity, IOPS requirements) based on expected load
2. Exact compound index specifications and performance testing requirements for query optimization
3. Backup and recovery procedures for hard delete scenarios - how to handle accidental deletions
4. Monitoring and alerting thresholds for performance metrics (specific values for slow query threshold, memory usage alerts)
5. Connection pooling configuration details (min/max connections, timeout values) for Prisma with MongoDB
6. Specific field validation rules for Prisma schema implementation (exact regex patterns, length constraints)
7. Error handling strategies for MongoDB connection failures and retry logic
8. Data migration procedures for future schema changes (field additions, type changes, collection restructuring)
9. Background job implementation details for category rename updates (queue system, batch size, error handling)
10. Vector ID synchronization strategy between MongoDB and Qdrant (how to handle Qdrant failures, orphaned vector IDs)
11. Transaction timeout configuration for multi-document operations
12. Read preference configuration for specific query patterns (when to use secondary reads)
13. Write concern configuration for critical operations (note creation, sharing) vs. non-critical operations (category updates)
14. Index maintenance procedures (rebuilding, dropping unused indexes) and monitoring
15. Document size monitoring and alerting implementation details
</unresolved_issues>
</conversation_summary>

