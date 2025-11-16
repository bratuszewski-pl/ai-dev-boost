# API Endpoint Implementation Plan: GET /api/tags

## 1. Endpoint Overview

The GET /api/tags endpoint retrieves all tags used by the authenticated user across all their notes, along with usage counts. It supports sorting by name or count.

**Key Functionality:**
- Retrieve all user's tags
- Calculate usage counts per tag
- Support sorting by name or count
- Return tag list with counts

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/tags`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **Query Parameters**:
  - `sortBy`: string (optional, "name" | "count", default: "name")
  - `sortOrder`: string (optional, "asc" | "desc", default: "asc")
- **Request Body**: None

## 3. Types Used

### Response Types
- `TagsListResponse` (from `common/models.ts`)
  - `tags: Tag[]`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "tags": [
    {
      "name": "string",
      "count": 5
    }
  ]
}
```

### Error Responses
- **401 Unauthorized**: Invalid token
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Query Parameter Validation**: Validate sortBy and sortOrder
3. **Tag Aggregation**: Aggregate tags from user's notes
4. **Count Calculation**: Count occurrences of each tag
5. **Sorting**: Sort by name or count as specified
6. **Result Formatting**: Format as Tag array
7. **Response Generation**: Return tags with counts
8. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Only return tags from user's notes
- Filter by userId

## 7. Error Handling

- **401**: Invalid token
- **500**: Database errors

## 8. Performance Considerations

- Use MongoDB aggregation pipeline
- Index on userId and tags array
- Cache tag lists (TTL: 10 minutes)
- Efficient aggregation queries

## 9. Implementation Steps

1. Setup route with authentication
2. Validate query parameters
3. Build aggregation query
4. Aggregate tags and counts
5. Apply sorting
6. Format results
7. Return response
8. Handle errors
9. Add logging
10. Write tests
11. Document

