# API Endpoint Implementation Plan: GET /api/search

## 1. Endpoint Overview

The GET /api/search endpoint provides multi-modal search functionality supporting date range, category, keyword, and semantic search. It returns paginated results with relevance scores for semantic searches and supports filtering by tags.

**Key Functionality:**
- Support multiple search types (date, category, keyword, semantic)
- Perform efficient database queries with proper indexing
- Execute semantic search using Qdrant vector database
- Return paginated results with relevance scores
- Support tag filtering across all search types

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/search`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **Query Parameters**:
  - `type`: string (required, "date" | "category" | "keyword" | "semantic")
  - `query`: string (required for keyword/semantic, optional for others)
  - `startDate`: string (optional, ISO 8601 date, required for date search)
  - `endDate`: string (optional, ISO 8601 date, required for date search)
  - `categoryId`: string (optional, required for category search)
  - `tags`: string (optional, comma-separated tags)
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)

## 3. Types Used

### Query Parameter Types
- `SearchQueryParams` (from `common/models.ts`)

### Response Types
- `SearchResponse` (from `common/models.ts`)
  - `results: SearchResult[]`
  - `pagination: OffsetPagination`
  - `searchType: SearchType`
  - `queryTime: number`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "preview": "string",
      "categoryId": "string | null",
      "categoryName": "string | null",
      "tags": ["string"],
      "keywords": ["string"],
      "relevanceScore": 0.95,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  },
  "searchType": "semantic",
  "queryTime": 250
}
```

### Error Responses
- **400 Bad Request**: Invalid search type or missing required parameters
- **401 Unauthorized**: Invalid or missing token
- **408 Request Timeout**: Semantic search exceeded 1 minute timeout
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Verify JWT token
   - Extract userId

2. **Query Parameter Validation**
   - Validate search type
   - Validate required parameters per search type
   - Validate date formats
   - Validate ObjectId formats

3. **Search Type Routing**
   - Route to appropriate search handler based on type

4. **Date Search**
   - Query notes where createdAt between startDate and endDate
   - Apply userId filter
   - Apply category/tag filters if provided
   - Sort by createdAt desc
   - Apply pagination

5. **Category Search**
   - Query notes where categoryId matches
   - Apply userId filter
   - Apply tag filters if provided
   - Sort by createdAt desc
   - Apply pagination

6. **Keyword Search**
   - Query notes where:
     - text contains keywords (case-insensitive)
     - OR keywords array contains search terms
     - OR tags array contains search terms
   - Apply userId filter
   - Apply category/tag filters if provided
   - Sort by relevance or createdAt
   - Apply pagination

7. **Semantic Search**
   - Convert query to vector embedding using OpenAI
   - Search Qdrant for similar vectors
   - Get note IDs from Qdrant results
   - Query MongoDB for notes by IDs
   - Apply userId filter
   - Apply category/tag filters if provided
   - Sort by relevance score
   - Apply pagination
   - Include relevance scores in results

8. **Result Formatting**
   - Format results according to `SearchResult` type
   - Calculate pagination metadata
   - Measure query time

9. **Response Generation**
   - Format response with results, pagination, searchType, queryTime
   - Return 200 OK

## 6. Security Considerations

### Authentication
- Require valid JWT token
- Filter results by userId

### Input Validation
- Validate search type
- Validate date ranges (max 1 year)
- Validate query length (max 500 chars for semantic)
- Sanitize search queries

### Rate Limiting
- Limit semantic searches (expensive)
- Track search requests per user

## 7. Error Handling

### Validation Errors (400)
- Invalid search type
- Missing required parameters
- Invalid date format
- Date range too large

### Timeout Errors (408)
- Semantic search timeout (60 seconds)

### Server Errors (500)
- Database errors
- Qdrant errors
- OpenAI API errors

## 8. Performance Considerations

### Database Optimization
- Use appropriate indexes for each search type
- Index on userId + createdAt for date search
- Index on userId + categoryId for category search
- Index on userId + tags for tag filtering
- Full-text index for keyword search

### Semantic Search Optimization
- Cache query embeddings in Redis
- Cache search results (TTL: 5 minutes)
- Use efficient vector search in Qdrant
- Limit result set size

### Caching Strategy
- Cache frequent searches
- Cache query embeddings
- Use Redis for caching

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route with `searchSchema`
   - Add authentication middleware

2. **Create Search Service**
   - Implement search methods for each type
   - Inject Prisma, Qdrant, OpenAI clients

3. **Implement Query Validation**
   - Validate search type
   - Validate required parameters
   - Validate date ranges

4. **Implement Date Search**
   - Build date range query
   - Apply filters
   - Execute query

5. **Implement Category Search**
   - Build category query
   - Apply filters
   - Execute query

6. **Implement Keyword Search**
   - Build text search query
   - Search in text, keywords, tags
   - Apply filters
   - Execute query

7. **Implement Semantic Search**
   - Generate query embedding
   - Search Qdrant
   - Retrieve notes from MongoDB
   - Apply filters
   - Sort by relevance

8. **Implement Result Formatting**
   - Format results
   - Calculate pagination
   - Measure query time

9. **Implement Response Formatting**
   - Format response
   - Return 200 OK

10. **Implement Error Handling**
    - Handle all error scenarios
    - Log errors

11. **Add Logging**
    - Log search queries
    - Log performance metrics
    - Log errors

12. **Write Integration Tests**
    - Test each search type
    - Test filtering
    - Test pagination
    - Test error scenarios

13. **Documentation**
    - Add JSDoc comments
    - Document search types
    - Document error codes

