# API Endpoint Implementation Plan: GET /api/notes

## 1. Endpoint Overview

The GET /api/notes endpoint retrieves a paginated list of notes belonging to the authenticated user. It supports filtering by category and tags, sorting by creation or update date, and both cursor-based and offset-based pagination. The endpoint returns note previews (title, preview text, metadata) rather than full note content for performance.

**Key Functionality:**
- Retrieve user's notes with pagination
- Filter by category and tags
- Sort by createdAt or updatedAt
- Support cursor-based and offset-based pagination
- Return note previews (not full content)

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/notes`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **Query Parameters**:
  - `page`: number (optional, default: 1, min: 1)
  - `limit`: number (optional, default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime for cursor-based pagination)
  - `categoryId`: string (optional, MongoDB ObjectId, filter by category)
  - `tags`: string (optional, comma-separated tags)
  - `sortBy`: string (optional, "createdAt" | "updatedAt", default: "createdAt")
  - `sortOrder`: string (optional, "asc" | "desc", default: "desc")
- **Request Body**: None

## 3. Types Used

### Query Parameter Types
- `NotesQueryParams` (from `common/models.ts`)

### Response Types
- `NotesListResponse` (from `common/models.ts`)
  - `notes: NotePreview[]`
  - `pagination: CursorPagination`

### Internal Types
- `NotePreview` - Note preview with title, preview text, metadata
- `CursorPagination` - Pagination information

### Database Models (Prisma)
- `Note` model with compound indexes

## 4. Response Details

### Success Response (200 OK)
```json
{
  "notes": [
    {
      "id": "string",
      "title": "string",
      "preview": "string",
      "categoryId": "string | null",
      "categoryName": "string | null",
      "tags": ["string"],
      "keywords": ["string"],
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": true,
    "nextCursor": "ISO 8601 datetime | null"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid query parameters
- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Extract JWT token from Authorization header
   - Verify token validity and extract userId
   - Validate user exists

2. **Query Parameter Validation**
   - Validate query parameters against `getNotesSchema`
   - Set defaults for optional parameters
   - Validate ObjectId format for categoryId
   - Parse tags from comma-separated string
   - Validate sortBy and sortOrder values

3. **Database Query Construction**
   - Build MongoDB query with filters:
     - userId (required, from JWT)
     - categoryId (if provided)
     - tags (if provided, use $in operator)
   - Apply sorting (sortBy and sortOrder)
   - Determine pagination strategy:
     - Use cursor-based if cursor provided
     - Use offset-based if page provided
     - Default to cursor-based

4. **Cursor-Based Pagination** (if cursor provided)
   - Query notes where:
     - userId matches
     - createdAt < cursor (for desc) or createdAt > cursor (for asc)
     - Apply category and tag filters
   - Limit results to `limit` parameter
   - Sort by createdAt with specified order
   - Calculate nextCursor from last result's createdAt

5. **Offset-Based Pagination** (if page provided)
   - Calculate skip value: (page - 1) * limit
   - Query notes with skip and limit
   - Apply all filters and sorting
   - Count total documents for hasMore calculation

6. **Note Preview Generation**
   - Extract title from note content (first line or first 50 chars)
   - Generate preview text (first 200 chars of content)
   - Include category name (join with categories if needed)
   - Format according to `NotePreview` type

7. **Response Generation**
   - Format notes array
   - Calculate pagination metadata
   - Return 200 OK status

## 6. Security Considerations

### Authentication
- Require valid JWT token
- Verify userId from token matches query
- Never return notes from other users

### Authorization
- Filter notes by userId from JWT
- Ensure categoryId belongs to user (if filtering)
- Prevent unauthorized access to notes

### Input Validation
- Validate ObjectId format for categoryId
- Validate query parameters
- Sanitize tag inputs
- Prevent NoSQL injection

### Data Protection
- Never return sensitive user data
- Only return user's own notes
- Use parameterized queries (Prisma)

## 7. Error Handling

### Validation Errors (400 Bad Request)
- **Invalid page number**: "Page must be a positive integer"
- **Invalid limit**: "Limit must be between 1 and 100"
- **Invalid cursor format**: "Cursor must be a valid ISO 8601 datetime"
- **Invalid categoryId format**: "Invalid category ID format"
- **Invalid sortBy**: "sortBy must be 'createdAt' or 'updatedAt'"
- **Invalid sortOrder**: "sortOrder must be 'asc' or 'desc'"

### Authentication Errors (401 Unauthorized)
- **Missing token**: "Authentication token required"
- **Invalid token**: "Invalid or expired authentication token"

### Server Errors (500 Internal Server Error)
- **Database connection error**: Log error, return generic message
- **Query execution error**: Log error, return generic message
- **Unexpected errors**: Log full error details, return generic message

### Error Logging
- Use Winston logger for structured logging
- Log all errors with:
  - Error message and stack trace
  - User ID
  - Query parameters
  - Timestamp and request ID

## 8. Performance Considerations

### Database Optimization
- Use compound index: `{ userId: 1, createdAt: -1 }`
- Use index: `{ userId: 1, categoryId: 1 }` for category filtering
- Use index: `{ userId: 1, tags: 1 }` for tag filtering
- Use Prisma connection pooling
- Limit result set size (max 100 items)

### Query Optimization
- Use cursor-based pagination for large datasets
- Avoid counting total documents when using cursor pagination
- Use projection to return only needed fields
- Join category names efficiently

### Caching Strategy
- Consider caching frequently accessed note lists
- Cache category lookups
- Use Redis for caching (TTL: 5 minutes)
- Invalidate cache on note creation/update

### Response Optimization
- Return previews instead of full content
- Limit preview text length
- Minimize response payload size
- Use compression (gzip)

### Pagination Strategy
- Prefer cursor-based pagination for performance
- Use offset-based as fallback
- Calculate hasMore efficiently

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route in `backend/routes/notes.ts`
   - Import `getNotesSchema` from `backend/schemas.ts`
   - Add authentication middleware

2. **Create Note Service**
   - Create service method: `getNotes`
   - Implement filtering logic
   - Implement pagination logic
   - Inject Prisma client

3. **Implement Query Parameter Validation**
   - Validate against schema
   - Set defaults
   - Parse and validate parameters

4. **Implement Database Query**
   - Build query with filters
   - Apply sorting
   - Implement cursor-based pagination
   - Implement offset-based pagination

5. **Implement Note Preview Generation**
   - Extract title from content
   - Generate preview text
   - Join category names
   - Format according to type

6. **Implement Response Formatting**
   - Format notes array
   - Calculate pagination metadata
   - Set proper HTTP status code (200)

7. **Implement Error Handling**
   - Handle validation errors
   - Handle database errors
   - Log errors appropriately

8. **Add Logging**
   - Log successful queries
   - Log errors
   - Log performance metrics

9. **Write Integration Tests**
   - Test successful retrieval
   - Test filtering
   - Test pagination
   - Test sorting
   - Test error scenarios

10. **Documentation**
    - Add JSDoc comments
    - Document query parameters
    - Document error codes
    - Update API documentation

