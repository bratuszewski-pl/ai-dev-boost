# API Endpoint Implementation Plan: DELETE /api/notes/:id

## 1. Endpoint Overview

The DELETE /api/notes/:id endpoint permanently deletes a note (hard delete) from MongoDB. It verifies user ownership, removes the note document, cleans up associated resources (vector embeddings in Qdrant, images in cloud storage), and returns a success message.

**Key Functionality:**
- Permanently delete note from MongoDB
- Verify note ownership
- Clean up vector embeddings in Qdrant
- Clean up images in cloud storage
- Remove sharing relationships
- Return success confirmation

## 2. Request Details

- **HTTP Method**: DELETE
- **URL Structure**: `/api/notes/:id`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Body**: None

## 3. Types Used

### Response Types
- `DeleteNoteResponse` (from `common/models.ts`)
  - `message: string`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Note deleted successfully"
}
```

### Error Responses
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User does not own note
- **404 Not Found**: Note not found
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Verify JWT token
   - Extract userId

2. **Parameter Validation**
   - Validate note ID format

3. **Note Retrieval**
   - Query note by ID
   - Return 404 if not found

4. **Ownership Verification**
   - Verify userId matches note.userId
   - Return 403 if not owner

5. **Resource Cleanup**
   - Delete vector embedding from Qdrant (if vectorId exists)
   - Delete images from cloud storage
   - Handle cleanup errors gracefully

6. **Note Deletion**
   - Delete note from MongoDB using Prisma
   - Handle deletion errors

7. **Response Generation**
   - Return success message
   - Return 200 OK

## 6. Security Considerations

### Authentication & Authorization
- Require valid JWT token
- Verify note ownership
- Prevent deletion of shared notes by recipients

### Data Protection
- Only allow note owner to delete
- Clean up all associated resources
- Log deletion events

## 7. Error Handling

### Authentication Errors (401)
- Invalid or missing token

### Authorization Errors (403)
- User does not own note

### Not Found Errors (404)
- Note not found

### Server Errors (500)
- Database errors
- Cleanup errors (log but don't fail deletion)

## 8. Performance Considerations

### Database Operations
- Efficient note lookup
- Atomic deletion
- Index on userId and _id

### Resource Cleanup
- Clean up asynchronously if possible
- Handle cleanup failures gracefully
- Don't block deletion on cleanup errors

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route with `deleteNoteSchema`
   - Add authentication middleware

2. **Implement Note Retrieval**
   - Query note by ID
   - Check ownership

3. **Implement Resource Cleanup**
   - Delete vector embedding
   - Delete images
   - Handle errors gracefully

4. **Implement Note Deletion**
   - Delete from MongoDB
   - Handle errors

5. **Implement Response Formatting**
   - Return success message
   - Return 200 OK

6. **Implement Error Handling**
   - Handle all error scenarios
   - Log errors

7. **Add Logging**
   - Log deletions
   - Log errors

8. **Write Integration Tests**
   - Test successful deletion
   - Test ownership verification
   - Test error scenarios

9. **Documentation**
   - Add JSDoc comments
   - Document error codes

