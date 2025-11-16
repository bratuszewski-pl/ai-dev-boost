# API Endpoint Implementation Plan: POST /api/notes/:id/share

## 1. Endpoint Overview

The POST /api/notes/:id/share endpoint shares a note with another user by adding a sharing relationship to the note's sharedWith array. It verifies note ownership, validates the recipient exists, and prevents sharing with self or duplicate shares.

**Key Functionality:**
- Share note with another user
- Verify note ownership
- Validate recipient exists
- Prevent self-sharing and duplicates
- Add sharing relationship to note

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/notes/:id/share`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**: `id` (MongoDB ObjectId, note ID)
- **Request Body**:
```typescript
{
  username: string (required, recipient username)
}
```

## 3. Types Used

### Request Types
- `ShareNoteRequest` (from `common/models.ts`)

### Response Types
- `ShareNoteResponse` (from `common/models.ts`)

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Note shared successfully",
  "noteId": "string",
  "sharedWith": {
    "userId": "string",
    "username": "string"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid input or cannot share with self
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own note
- **404 Not Found**: Note or recipient not found
- **409 Conflict**: Note already shared with user
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Parameter Validation**: Validate note ID format
3. **Note Retrieval**: Query note by ID
4. **Ownership Verification**: Verify userId matches note.userId
5. **Request Validation**: Validate username provided
6. **Recipient Lookup**: Find user by username
7. **Self-Sharing Check**: Verify recipient is not the owner
8. **Duplicate Check**: Check if note already shared with recipient
9. **Add Sharing Relationship**: Add to note.sharedWith array
10. **Update Note**: Save note with new sharing relationship
11. **Response Formatting**: Return success with recipient info
12. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Verify note ownership
- Validate recipient exists
- Prevent self-sharing
- Prevent duplicate shares

## 7. Error Handling

- **400**: Invalid username, self-sharing attempt
- **401**: Invalid token
- **403**: User does not own note
- **404**: Note or recipient not found
- **409**: Already shared with user
- **500**: Database errors

## 8. Performance Considerations

- Index on username for user lookup
- Efficient duplicate check
- Atomic update of sharedWith array

## 9. Implementation Steps

1. Setup route with authentication
2. Validate note ID and request body
3. Query note and verify ownership
4. Lookup recipient user
5. Check self-sharing and duplicates
6. Add sharing relationship
7. Update note
8. Format and return response
9. Handle errors
10. Add logging
11. Write tests
12. Document

