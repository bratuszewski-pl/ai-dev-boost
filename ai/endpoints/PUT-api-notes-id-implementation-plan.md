# API Endpoint Implementation Plan: PUT /api/notes/:id

## 1. Endpoint Overview

The PUT /api/notes/:id endpoint updates an existing note with optimistic concurrency control. It validates the request, checks version numbers to prevent concurrent update conflicts, processes images if provided, updates the note in MongoDB, and triggers AI analysis if content changed.

**Key Functionality:**
- Update note content, category, and tags
- Implement optimistic concurrency control using version field
- Process and upload new images
- Validate ownership
- Trigger AI analysis if content changed
- Handle version conflicts

## 2. Request Details

- **HTTP Method**: PUT
- **URL Structure**: `/api/notes/:id`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Body**:
```typescript
{
  content?: {
    text?: string (max: 2000 words)
    links?: string[]
    images?: string[]
  }
  categoryId?: string
  tags?: string[]
  version: number (required, current version for optimistic locking)
}
```

## 3. Types Used

### Request Types
- `UpdateNoteRequest` (from `common/models.ts`)

### Response Types
- `UpdateNoteResponse` (from `common/models.ts`)

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Note updated successfully",
  "note": { /* full note object */ }
}
```

### Error Responses
- **400 Bad Request**: Invalid input or validation errors
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own note
- **404 Not Found**: Note not found
- **409 Conflict**: Version conflict
- **413 Payload Too Large**: Image size exceeded
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Verify JWT token
   - Extract userId

2. **Request Validation**
   - Validate request body against schema
   - Validate note ID format
   - Validate content constraints
   - Validate version number

3. **Note Retrieval**
   - Query note by ID
   - Return 404 if not found

4. **Ownership Verification**
   - Verify userId matches note.userId
   - Return 403 if not owner

5. **Version Conflict Check**
   - Compare request version with note.version
   - Return 409 if versions don't match

6. **Category Validation** (if categoryId provided)
   - Verify category exists and belongs to user
   - Return 404 if not found

7. **Image Processing** (if images provided)
   - Process and upload images
   - Generate image metadata

8. **Note Update**
   - Update note fields
   - Increment version number
   - Set updatedAt timestamp
   - Set aiAnalysisStatus to 'pending' if content changed

9. **AI Analysis Queue** (if content changed)
   - Queue AI analysis job

10. **Response Generation**
    - Format updated note
    - Return 200 OK

## 6. Security Considerations

### Authentication & Authorization
- Require valid JWT token
- Verify note ownership
- Prevent updates to shared notes by recipients

### Input Validation
- Validate all input fields
- Sanitize text content
- Validate image formats and sizes
- Validate ObjectId formats

### Optimistic Concurrency Control
- Prevent lost updates
- Handle version conflicts gracefully
- Return clear error messages

## 7. Error Handling

### Validation Errors (400)
- Invalid input format
- Content exceeds limits
- Invalid version number

### Authorization Errors (403)
- User does not own note

### Conflict Errors (409)
- Version mismatch: "Note has been modified. Please refresh and try again."

### Not Found Errors (404)
- Note not found
- Category not found

## 8. Performance Considerations

### Database Operations
- Use atomic update operations
- Efficient version checking
- Index on userId and _id

### Image Processing
- Process images asynchronously if possible
- Optimize image sizes
- Use CDN for delivery

### Caching
- Invalidate note cache on update
- Invalidate related caches

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route with `updateNoteSchema`
   - Add authentication middleware

2. **Implement Request Validation**
   - Validate request body
   - Validate version number

3. **Implement Note Retrieval**
   - Query note by ID
   - Check ownership

4. **Implement Version Conflict Check**
   - Compare versions
   - Return 409 if mismatch

5. **Implement Note Update**
   - Update note fields
   - Increment version
   - Save to database

6. **Implement AI Analysis Queue**
   - Queue analysis if content changed

7. **Implement Response Formatting**
   - Format updated note
   - Return 200 OK

8. **Implement Error Handling**
   - Handle all error scenarios
   - Log errors

9. **Add Logging**
   - Log updates
   - Log errors

10. **Write Integration Tests**
    - Test successful update
    - Test version conflicts
    - Test error scenarios

11. **Documentation**
    - Add JSDoc comments
    - Document error codes

