# API Endpoint Implementation Plan: GET /api/notes/shared

## 1. Endpoint Overview

The GET /api/notes/shared endpoint retrieves all notes that have been shared with the authenticated user. It supports pagination and returns note previews with information about who shared each note.

**Key Functionality:**
- Retrieve notes shared with user
- Support pagination (cursor-based or offset-based)
- Include sharing metadata (who shared, when)
- Return note previews

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/notes/shared`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **Query Parameters**:
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime)
- **Request Body**: None

## 3. Types Used

### Response Types
- `SharedNotesListResponse` (from `common/models.ts`)
  - `notes: SharedNotePreview[]`
  - `pagination: CursorPagination`

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
      "sharedBy": {
        "userId": "string",
        "username": "string",
        "sharedAt": "ISO 8601 datetime"
      },
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
- **401 Unauthorized**: Invalid token
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Query Parameter Validation**: Validate pagination parameters
3. **Note Query**: Query notes where userId in sharedWith array
4. **Pagination**: Apply cursor-based or offset-based pagination
5. **Sharing Metadata**: Extract sharing information from sharedWith array
6. **User Lookup**: Get usernames for sharedBy information
7. **Result Formatting**: Format as SharedNotePreview
8. **Response Generation**: Return notes with pagination
9. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Only return notes shared with authenticated user
- Filter by userId in sharedWith array

## 7. Error Handling

- **400**: Invalid query parameters
- **401**: Invalid token
- **500**: Database errors

## 8. Performance Considerations

- Index on sharedWith array for efficient queries
- Efficient pagination
- Cache user lookups for sharedBy info

## 9. Implementation Steps

1. Setup route with authentication
2. Validate query parameters
3. Build query for shared notes
4. Apply pagination
5. Extract sharing metadata
6. Lookup user information
7. Format results
8. Return response
9. Handle errors
10. Add logging
11. Write tests
12. Document

