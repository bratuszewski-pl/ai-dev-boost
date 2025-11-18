<database_planning_output>
<questions>
1. How should we handle the relationship between note sharing and user permissions - should sharedWith arrays include full user objects or just references to maintain data consistency when usernames change?

2. What's the optimal strategy for storing and indexing the vectorId field to support efficient lookups when syncing between MongoDB and Qdrant vector database?

3. Should we implement a separate collection for tracking AI analysis job status and retry attempts, or embed this information directly in note documents?

4. How should we handle the categoryName denormalization in note documents - should we update all notes when a category is renamed, or only fetch category name on read?

5. What's the best approach for handling image storage references - should we store full S3/Cloudinary URLs, relative paths, or file identifiers in the note documents?

6. How should we structure the tags array to support efficient searching - should tags be normalized (lowercase, trimmed) at write time or query time?

7. What compound index strategy should we use for the shared notes query pattern - should we create a separate index on sharedWith.userId or rely on application-level filtering?

8. Should we implement a separate collection for tracking note access patterns and analytics, or is this out of scope for MVP?

9. How should we handle the version field for optimistic concurrency control - should we use a simple incrementing number or a more sophisticated approach like timestamps?

10. What's the optimal document structure for storing note content text to support efficient full-text search while staying under MongoDB's 16MB limit?

11. Should we create a text index on note content for keyword search, or rely entirely on application-level text processing and Qdrant for semantic search?

12. How should we handle the relationship between notes and their AI analysis status - should we implement a separate collection for analysis results or keep everything embedded?

13. What's the best strategy for handling large note collections (approaching 10,000 notes per user) - should we implement automatic archival or rely on pagination?

14. Should we create indexes on the keywords array field to support efficient keyword-based searches, or is array indexing sufficient?

15. How should we structure the links array in note content - should we validate and normalize URLs at write time or query time?

16. What's the optimal approach for handling note deletion when notes are shared with other users - should shared notes be automatically removed or maintained separately?

17. Should we implement database-level unique constraints on username in the users collection, or rely on application-level validation?

18. How should we handle the createdAt and updatedAt timestamp fields - should we use MongoDB's automatic timestamp management or application-level timestamp generation?

19. What's the best strategy for handling concurrent AI analysis updates to the same note - should we use MongoDB transactions or optimistic locking?

20. Should we implement a separate collection for storing search query history and user search patterns, or is this out of scope for MVP?

21. How should we structure the note content to support efficient extraction of the first line as a title for preview purposes?

22. What's the optimal index strategy for supporting the multi-modal search requirements (date, category, keyword, semantic) while maintaining write performance?

23. Should we implement database-level validation for the 2000-word limit on note content, or rely entirely on application-level validation?

24. How should we handle the relationship between categories and notes when a category is deleted - should we set categoryId to null or maintain orphaned references?

25. What's the best approach for storing and indexing the aiAnalysisStatus field to support efficient queries for notes with pending or failed analysis?

26. Should we implement a separate collection for storing user session data, or rely entirely on Redis for session management?

27. How should we structure the note document to support efficient partial updates (e.g., updating only tags without rewriting the entire document)?

28. What's the optimal strategy for handling note content that includes special characters, emojis, or multi-byte characters in terms of storage and indexing?

29. Should we create a separate collection for tracking note sharing history and audit logs, or is this out of scope for MVP?

30. How should we handle the relationship between notes and their vector embeddings - should we store embedding metadata in MongoDB or rely entirely on Qdrant?
</questions>

<recommendations>
1. Store sharedWith as embedded arrays with userId and username for efficient reads, but implement application-level validation to ensure username consistency when users update their profiles.

2. Create a unique index on vectorId field (sparse index) to support efficient lookups and maintain referential integrity between MongoDB and Qdrant, with null values allowed for notes without vector embeddings.

3. Embed AI analysis status directly in note documents using the aiAnalysisStatus field to minimize queries and support efficient filtering, with retry attempts tracked in application-level job queues.

4. Denormalize categoryName in note documents for read performance, but implement a background job to update all affected notes when a category is renamed to maintain data consistency.

5. Store full cloud storage URLs (S3/Cloudinary) in image metadata objects within note documents for direct access, with file identifiers as a secondary reference for management operations.

6. Normalize tags at write time (lowercase, trimmed, deduplicated) and store in tags array to ensure consistent searching and reduce query complexity.

7. Create a compound index on sharedWith.userId for efficient shared notes queries, but note that MongoDB's array indexing will automatically create multikey indexes for array fields.

8. Skip analytics and access pattern tracking for MVP scope, focusing on core functionality and deferring analytics to future iterations.

9. Use a simple incrementing version number field for optimistic concurrency control, starting at 1 and incrementing on each update, with application-level validation to prevent concurrent modification conflicts.

10. Store note content text as a single string field with proper encoding (UTF-8) to support efficient storage and retrieval, ensuring the total document size stays well under 16MB even with embedded arrays and metadata.

11. Create a text index on note content text field and keywords array to support efficient keyword-based searches, while relying on Qdrant for semantic search capabilities.

12. Keep AI analysis status and results embedded in note documents for optimal read performance, avoiding additional collection overhead for MVP simplicity.

13. Rely on cursor-based pagination using createdAt timestamps for handling large note collections, with no automatic archival needed for MVP scope.

14. MongoDB automatically creates multikey indexes for array fields, so the keywords array will be indexed by default - no additional index needed unless specific query patterns require compound indexes.

15. Validate and normalize URLs at write time (convert to absolute URLs, remove trailing slashes) and store normalized URLs in the links array to ensure consistency and prevent duplicates.

16. When a note is deleted, automatically remove it from all sharedWith arrays in other users' accessible notes through application-level cleanup, maintaining data consistency.

17. Implement both database-level unique index on username field and application-level validation to ensure username uniqueness and provide clear error messages.

18. Use application-level timestamp generation (createdAt, updatedAt) with automatic updates on document modification to maintain consistency and support application-level business logic.

19. Use MongoDB transactions for atomic updates when modifying note content and AI analysis status simultaneously, with optimistic locking using version fields for conflict detection.

20. Skip search query history and user pattern tracking for MVP scope, focusing on core search functionality without analytics overhead.

21. Extract and store the first line of note content as a separate title field at write time for efficient preview generation, with fallback to content extraction if title is empty.

22. Create compound indexes: {userId: 1, createdAt: -1} for date-based queries, {userId: 1, categoryId: 1} for category filtering, and text index on content and keywords for keyword search, balancing read performance with write overhead.

23. Rely on application-level validation for the 2000-word limit to provide user-friendly error messages, with database-level size constraints as a safety net (16MB document limit).

24. Set categoryId to null and remove categoryName when a category is deleted, implementing application-level cleanup to maintain referential integrity without orphaned references.

25. Create a compound index on {userId: 1, aiAnalysisStatus: 1} to support efficient queries for notes with specific analysis status, enabling quick filtering of pending or failed analyses.

26. Rely entirely on Redis for session management to leverage its TTL capabilities and reduce MongoDB load, storing only user authentication data in MongoDB users collection.

27. Use MongoDB's update operators ($set, $push, $pull) for efficient partial updates, allowing updates to specific fields (tags, keywords) without rewriting entire documents.

28. Ensure MongoDB uses UTF-8 encoding for all text fields to properly handle special characters, emojis, and multi-byte characters, with proper collation settings for text indexes.

29. Skip audit logs and sharing history tracking for MVP scope, implementing basic sharing functionality without historical tracking overhead.

30. Store only the vectorId reference in MongoDB note documents, relying entirely on Qdrant for vector storage and semantic search, maintaining a clean separation of concerns between structured and vector data.
</recommendations>
</database_planning_output>

