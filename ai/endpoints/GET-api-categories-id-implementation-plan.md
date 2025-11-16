# API Endpoint Implementation Plan: GET /api/categories/:id

## 1. Endpoint Overview

The GET /api/categories/:id endpoint retrieves a single category by ID with note count, verifying the user owns the category.

**Key Functionality:**
- Retrieve category by ID
- Verify ownership
- Include note count
- Return category details

## 2. Request Details

- **HTTP Method**: GET
- **URL Structure**: `/api/categories/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Body**: None

## 3. Types Used

### Response Types
- `CategoryResponse` (from `common/models.ts`)
  - `category: CategoryWithCount`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "category": {
    "id": "string",
    "name": "string",
    "userId": "string",
    "noteCount": 5,
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### Error Responses
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own category
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Parameter Validation**: Validate category ID format
3. **Category Retrieval**: Query category by ID
4. **Ownership Verification**: Verify userId matches
5. **Note Count Calculation**: Count notes with this categoryId
6. **Response Formatting**: Return category with count
7. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Verify category ownership
- Never return other users' categories

## 7. Error Handling

- **401**: Invalid token
- **403**: User does not own category
- **404**: Category not found
- **500**: Database errors

## 8. Performance Considerations

- Index on _id and userId
- Efficient note count query
- Cache category lookups

## 9. Implementation Steps

1. Setup route with authentication
2. Validate category ID
3. Query category and verify ownership
4. Calculate note count
5. Format and return response
6. Handle errors
7. Add logging
8. Write tests
9. Document

