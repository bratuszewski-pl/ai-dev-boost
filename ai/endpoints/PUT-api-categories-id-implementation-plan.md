# API Endpoint Implementation Plan: PUT /api/categories/:id

## 1. Endpoint Overview

The PUT /api/categories/:id endpoint updates an existing category's name, verifying ownership and ensuring the new name is unique per user.

**Key Functionality:**
- Update category name
- Verify ownership
- Check name uniqueness
- Return updated category

## 2. Request Details

- **HTTP Method**: PUT
- **URL Structure**: `/api/categories/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Body**:
```typescript
{
  name: string (required, min: 1, max: 100, unique per user)
}
```

## 3. Types Used

### Request Types
- `UpdateCategoryRequest` (from `common/models.ts`)

### Response Types
- `UpdateCategoryResponse` (from `common/models.ts`)

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Category updated successfully",
  "category": {
    "id": "string",
    "name": "string",
    "userId": "string",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own category
- **404 Not Found**: Category not found
- **409 Conflict**: Category name already exists
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Parameter Validation**: Validate category ID
3. **Category Retrieval**: Query category by ID
4. **Ownership Verification**: Verify userId matches
5. **Uniqueness Check**: Check new name is unique (excluding current category)
6. **Category Update**: Update category name and updatedAt
7. **Response Formatting**: Return updated category
8. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Verify category ownership
- Validate name format
- Enforce uniqueness

## 7. Error Handling

- **400**: Invalid name format
- **401**: Invalid token
- **403**: User does not own category
- **404**: Category not found
- **409**: Name already exists
- **500**: Database errors

## 8. Performance Considerations

- Index on userId + name
- Efficient uniqueness check
- Cache invalidation on update

## 9. Implementation Steps

1. Setup route with authentication
2. Validate category ID and request body
3. Query category and verify ownership
4. Check name uniqueness
5. Update category
6. Format and return response
7. Handle errors
8. Add logging
9. Write tests
10. Document

