# API Endpoint Implementation Plan: GET /api/notes/:id

## 1. Endpoint Overview

The GET /api/notes/:id endpoint retrieves a single note by its ID with full content including text, links, images, and metadata. The endpoint verifies that the user has access to the note (either as owner or as a recipient of a shared note) and returns the complete note data.

**Key Functionality:**
- Retrieve note by ID with full content
- Verify user access (owner or shared recipient)
- Return complete note data including content, metadata, and sharing information
- Handle read-only access for shared notes

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/notes/:id`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Body**: None

## 3. Types Used

### Response Types
- `NoteResponse` (from `common/models.ts`)
  - `note: Note`

### Internal Types
- `Note` - Full note entity with all fields
- `SharedWith` - Sharing relationship information

### Database Models (Prisma)
- `Note` model with embedded content and sharing arrays

## 4. Response Details

### Success Response (200 OK)
```json
{
  "note": {
    "id": "string",
    "userId": "string",
    "content": {
      "text": "string",
      "links": ["string"],
      "images": [...]
    },
    "categoryId": "string | null",
    "categoryName": "string | null",
    "tags": ["string"],
    "keywords": ["string"],
    "vectorId": "string | null",
    "version": 1,
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime",
    "sharedWith": [...]
  }
}
```

### Error Responses
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User does not have access to this note
- **404 Not Found**: Note not found
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Extract JWT token and verify validity
   - Extract userId from token

2. **Parameter Validation**
   - Validate note ID format (MongoDB ObjectId)
   - Return 400 if invalid format

3. **Note Retrieval**
   - Query MongoDB for note by ID
   - Return 404 if note not found

4. **Access Verification**
   - Check if userId matches note.userId (owner)
   - Check if userId is in note.sharedWith array (shared recipient)
   - Return 403 if user has no access

5. **Category Name Resolution**
   - If categoryId exists, query category name
   - Join category data if needed

6. **Response Generation**
   - Format note according to `Note` type
   - Include all note fields
   - Include sharing information
   - Return 200 OK

## 6. Security Considerations

### Authentication
- Require valid JWT token
- Verify userId from token

### Authorization
- Verify user owns note OR note is shared with user
- Never return notes user doesn't have access to
- Enforce read-only access for shared notes

### Input Validation
- Validate ObjectId format
- Prevent NoSQL injection

### Data Protection
- Only return notes user has access to
- Use parameterized queries

## 7. Error Handling

### Validation Errors (400 Bad Request)
- **Invalid note ID format**: "Invalid note ID format"

### Authentication Errors (401 Unauthorized)
- **Missing token**: "Authentication token required"
- **Invalid token**: "Invalid or expired authentication token"

### Authorization Errors (403 Forbidden)
- **No access**: "You do not have access to this note"

### Not Found Errors (404 Not Found)
- **Note not found**: "Note not found"

### Server Errors (500 Internal Server Error)
- **Database errors**: Log and return generic message

## 8. Performance Considerations

### Database Optimization
- Use index on _id (automatic in MongoDB)
- Use projection to return only needed fields
- Efficient category name lookup

### Caching
- Consider caching frequently accessed notes
- Cache category lookups
- Invalidate cache on note updates

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route with `getNoteSchema`
   - Add authentication middleware

2. **Implement Note Retrieval**
   - Query note by ID using Prisma
   - Handle not found

3. **Implement Access Verification**
   - Check ownership
   - Check sharing relationships
   - Return 403 if no access

4. **Implement Response Formatting**
   - Format note data
   - Include category name
   - Return 200 OK

5. **Implement Error Handling**
   - Handle all error scenarios
   - Log errors appropriately

6. **Add Logging**
   - Log access attempts
   - Log errors

7. **Write Integration Tests**
   - Test successful retrieval
   - Test access control
   - Test error scenarios

8. **Documentation**
   - Add JSDoc comments
   - Document error codes

