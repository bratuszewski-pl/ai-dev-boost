# API Endpoint Implementation Plan: DELETE /api/categories/:id

## 1. Endpoint Overview

The DELETE /api/categories/:id endpoint deletes a category and sets categoryId to null for all notes that had this category. It verifies ownership before deletion.

**Key Functionality:**
- Delete category
- Verify ownership
- Update notes to remove category reference
- Return count of updated notes

## 2. Request Details

- **HTTP Method**: DELETE
- **URL Structure**: `/api/categories/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**: `id` (MongoDB ObjectId)
- **Request Body**: None

## 3. Types Used

### Response Types
- `DeleteCategoryResponse` (from `common/models.ts`)
  - `message: string`
  - `notesUpdated: number`

## 4. Response Details

### Success Response (200 OK)
```json
{
  "message": "Category deleted successfully",
  "notesUpdated": 15
}
```

### Error Responses
- **401 Unauthorized**: Invalid token
- **403 Forbidden**: User does not own category
- **404 Not Found**: Category not found
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication**: Verify JWT, extract userId
2. **Parameter Validation**: Validate category ID
3. **Category Retrieval**: Query category by ID
4. **Ownership Verification**: Verify userId matches
5. **Update Notes**: Set categoryId to null for all notes with this category
6. **Count Updated Notes**: Track number of notes updated
7. **Delete Category**: Delete category document
8. **Response Formatting**: Return success message and count
9. **Return 200 OK**

## 6. Security Considerations

- Require valid JWT token
- Verify category ownership
- Only update user's own notes

## 7. Error Handling

- **401**: Invalid token
- **403**: User does not own category
- **404**: Category not found
- **500**: Database errors

## 8. Performance Considerations

- Use transaction for atomicity (optional)
- Efficient bulk update of notes
- Index on categoryId for note updates
- Cache invalidation

## 9. Implementation Steps

1. Setup route with authentication
2. Validate category ID
3. Query category and verify ownership
4. Update notes (set categoryId to null)
5. Count updated notes
6. Delete category
7. Format and return response
8. Handle errors
9. Add logging
10. Write tests
11. Document

