# API Endpoint Implementation Plan: GET /api/categories

## 1. Endpoint Overview

The GET /api/categories endpoint retrieves all categories belonging to the authenticated user. It optionally includes note counts per category and returns them sorted by creation date.

**Key Functionality:**
- Retrieve user's categories
- Optionally include note counts
- Return sorted list

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/categories`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **Query Parameters**:
  - `includeCounts`: boolean (optional, default: false)
- **Request Body**: None

## 3. Types Used

### Response Types
- `CategoriesListResponse` (from `common/models.ts`)
  - `categories: Category[]`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "noteCount": 5,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

### Error Responses
- **401 Unauthorized**: Invalid token
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Query Categories**: Query MongoDB for user's categories
3. **Calculate Note Counts** (if includeCounts=true): Aggregate note counts per category
4. **Format Response**: Return categories with optional counts
5. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Filter by userId
- Never return other users' categories

## 7. Error Handling

- **401**: Invalid token
- **500**: Database errors

## 8. Performance Considerations

- Index on userId
- Efficient aggregation for note counts
- Cache category lists (TTL: 5 minutes)

## 9. Implementation Steps

1. Setup route with authentication
2. Query categories by userId
3. Calculate note counts if requested
4. Format and return response
5. Handle errors appropriately
6. Add logging
7. Write tests
8. Document

