# API Endpoint Implementation Plan: DELETE /api/notes/:id/share/:userId

## 1. Endpoint Overview

The DELETE /api/notes/:id/share/:userId endpoint removes a sharing relationship by removing a user from a note's sharedWith array. It verifies note ownership and ensures the sharing relationship exists.

**Key Functionality:**
- Unshare note with specific user
- Verify note ownership
- Remove sharing relationship
- Return confirmation

## 2. Request Details

- **HTTP Method**: DELETE
- **URL Structure**: `/api/notes/:id/share/:userId`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**:
  - `id`: string (MongoDB ObjectId, note ID)
  - `userId`: string (MongoDB ObjectId, user to unshare with)
- **Request Body**: None

## 3. Types Used

### Response Types
- `UnshareNoteResponse` (from `common/models.ts`)

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Note unshared successfully",
  "noteId": "string",
  "unsharedWith": {
    "userId": "string",
    "username": "string"
  }
}
```

### Error Responses
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own note
- **404 Not Found**: Note or sharing relationship not found
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Parameter Validation**: Validate note ID and userId formats
3. **Note Retrieval**: Query note by ID
4. **Ownership Verification**: Verify userId matches note.userId
5. **Sharing Relationship Check**: Verify user exists in sharedWith array
6. **User Lookup**: Get username for response
7. **Remove Sharing**: Remove user from sharedWith array
8. **Update Note**: Save note with updated sharedWith
9. **Response Formatting**: Return success with user info
10. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Verify note ownership
- Only allow owner to unshare

## 7. Error Handling

- **401**: Invalid token
- **403**: User does not own note
- **404**: Note or sharing relationship not found
- **500**: Database errors

## 8. Performance Considerations

- Efficient array manipulation
- Atomic update operation

## 9. Implementation Steps

1. Setup route with authentication
2. Validate both ID parameters
3. Query note and verify ownership
4. Check sharing relationship exists
5. Lookup user for response
6. Remove from sharedWith array
7. Update note
8. Format and return response
9. Handle errors
10. Add logging
11. Write tests
12. Document

