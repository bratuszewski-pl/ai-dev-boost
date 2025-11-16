# REST API Plan

## 1. Resources

### 1.1 Users
- **Database Collection**: `users`
- **Description**: User accounts for authentication and authorization
- **Key Fields**: username (unique), password (hashed), createdAt, updatedAt

### 1.2 Notes
- **Database Collection**: `notes`
- **Description**: User notes containing text, links, and images with AI-generated metadata
- **Key Fields**: userId, content (embedded), categoryId, tags (array), keywords (array), vectorId, version, createdAt, updatedAt
- **Embedded Data**: text content, links array, images array with metadata

### 1.3 Categories
- **Database Collection**: `categories`
- **Description**: User-defined categories for organizing notes
- **Key Fields**: userId, name, createdAt, updatedAt

### 1.4 Note Shares
- **Database Collection**: `note_shares` (embedded in notes)
- **Description**: Sharing relationships between users and notes
- **Key Fields**: sharedWithUserId, sharedByUserId, noteId, createdAt

## 2. Endpoints

### 2.1 Authentication Endpoints

#### POST /api/auth/register
- **Description**: Register a new user account
- **Request Payload**:
```json
{
  "username": "string (required, unique, min: 3, max: 50)",
  "password": "string (required, min: 8)"
}
```
- **Response Payload** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "createdAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid input data or validation errors
  - `409 Conflict`: Username already exists
  - `500 Internal Server Error`: Server error during registration

#### POST /api/auth/login
- **Description**: Authenticate user and create session
- **Request Payload**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```
- **Response Payload** (200 OK):
```json
{
  "message": "Login successful",
  "token": "JWT token string",
  "user": {
    "id": "string",
    "username": "string"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing username or password
  - `401 Unauthorized`: Invalid credentials
  - `500 Internal Server Error`: Server error during authentication

#### POST /api/auth/logout
- **Description**: Invalidate user session
- **Headers**: `Authorization: Bearer <token>`
- **Response Payload** (200 OK):
```json
{
  "message": "Logout successful"
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token

#### GET /api/auth/me
- **Description**: Get current authenticated user information
- **Headers**: `Authorization: Bearer <token>`
- **Response Payload** (200 OK):
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "createdAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token

### 2.2 Notes Endpoints

#### GET /api/notes
- **Description**: Retrieve paginated list of user's notes with optional filtering and sorting
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime for cursor-based pagination)
  - `categoryId`: string (optional, filter by category)
  - `tags`: string (optional, comma-separated tags)
  - `sortBy`: string (optional, "createdAt" | "updatedAt", default: "createdAt")
  - `sortOrder`: string (optional, "asc" | "desc", default: "desc")
- **Response Payload** (200 OK):
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
      "keywords": ["string"],
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "hasMore": "boolean",
    "nextCursor": "string | null"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `400 Bad Request`: Invalid query parameters
  - `500 Internal Server Error`: Server error

#### GET /api/notes/:id
- **Description**: Retrieve a single note by ID with full content
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Response Payload** (200 OK):
```json
{
  "note": {
    "id": "string",
    "userId": "string",
    "content": {
      "text": "string",
      "links": ["string"],
      "images": [
        {
          "url": "string",
          "filename": "string",
          "mimeType": "string",
          "size": "number",
          "uploadedAt": "ISO 8601 datetime"
        }
      ]
    },
    "categoryId": "string | null",
    "categoryName": "string | null",
    "tags": ["string"],
    "keywords": ["string"],
    "vectorId": "string | null",
    "version": "number",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime",
    "sharedWith": [
      {
        "userId": "string",
        "username": "string",
        "sharedAt": "ISO 8601 datetime"
      }
    ]
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not have access to this note
  - `404 Not Found`: Note not found
  - `500 Internal Server Error`: Server error

#### POST /api/notes
- **Description**: Create a new note and trigger AI analysis
- **Headers**: `Authorization: Bearer <token>`
- **Request Payload**:
```json
{
  "content": {
    "text": "string (required, max: 2000 words)",
    "links": ["string (optional, valid URLs)"],
    "images": ["string (optional, base64 or file references)"]
  },
  "categoryId": "string (optional)",
  "tags": ["string (optional)"]
}
```
- **Response Payload** (201 Created):
```json
{
  "message": "Note created successfully",
  "note": {
    "id": "string",
    "userId": "string",
    "content": {
      "text": "string",
      "links": ["string"],
      "images": []
    },
    "categoryId": "string | null",
    "tags": ["string"],
    "keywords": [],
    "vectorId": "string | null",
    "version": 1,
    "aiAnalysisStatus": "pending",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid input data, validation errors, or content exceeds 2000 words
  - `401 Unauthorized`: Invalid or missing token
  - `404 Not Found`: Category not found (if categoryId provided)
  - `413 Payload Too Large`: Image file size exceeds limit
  - `500 Internal Server Error`: Server error

#### PUT /api/notes/:id
- **Description**: Update an existing note with optimistic concurrency control
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Payload**:
```json
{
  "content": {
    "text": "string (optional, max: 2000 words)",
    "links": ["string (optional, valid URLs)"],
    "images": ["string (optional, base64 or file references)"]
  },
  "categoryId": "string (optional)",
  "tags": ["string (optional)"],
  "version": "number (required, current version for optimistic locking)"
}
```
- **Response Payload** (200 OK):
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": "string",
    "userId": "string",
    "content": {
      "text": "string",
      "links": ["string"],
      "images": []
    },
    "categoryId": "string | null",
    "tags": ["string"],
    "keywords": ["string"],
    "vectorId": "string | null",
    "version": "number",
    "aiAnalysisStatus": "pending",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid input data, validation errors, or version mismatch
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this note
  - `404 Not Found`: Note not found
  - `409 Conflict`: Version conflict (concurrent update detected)
  - `413 Payload Too Large`: Image file size exceeds limit
  - `500 Internal Server Error`: Server error

#### DELETE /api/notes/:id
- **Description**: Delete a note permanently (hard delete)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Response Payload** (200 OK):
```json
{
  "message": "Note deleted successfully"
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this note
  - `404 Not Found`: Note not found
  - `500 Internal Server Error`: Server error

#### POST /api/notes/:id/analyze
- **Description**: Manually trigger AI analysis for a note (retry failed analysis)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Response Payload** (202 Accepted):
```json
{
  "message": "AI analysis queued",
  "noteId": "string",
  "status": "pending"
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not have access to this note
  - `404 Not Found`: Note not found
  - `429 Too Many Requests`: Rate limit exceeded for AI processing
  - `500 Internal Server Error`: Server error

### 2.3 Search Endpoints

#### GET /api/search
- **Description**: Multi-modal search endpoint supporting date, category, keyword, and semantic search
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `type`: string (required, "date" | "category" | "keyword" | "semantic")
  - `query`: string (required for keyword and semantic, optional for others)
  - `startDate`: string (optional, ISO 8601 date, required for date search)
  - `endDate`: string (optional, ISO 8601 date, required for date search)
  - `categoryId`: string (optional, required for category search)
  - `tags`: string (optional, comma-separated tags)
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
- **Response Payload** (200 OK):
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "preview": "string",
      "categoryId": "string | null",
      "categoryName": "string | null",
      "tags": ["string"],
      "keywords": ["string"],
      "relevanceScore": "number (0-1, only for semantic search)",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "hasMore": "boolean"
  },
  "searchType": "string",
  "queryTime": "number (milliseconds)"
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid search type or missing required parameters
  - `401 Unauthorized`: Invalid or missing token
  - `408 Request Timeout`: Semantic search exceeded 1 minute timeout
  - `500 Internal Server Error`: Server error

### 2.4 Categories Endpoints

#### GET /api/categories
- **Description**: Retrieve all categories for the authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `includeCounts`: boolean (optional, default: false, include note count per category)
- **Response Payload** (200 OK):
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "noteCount": "number (if includeCounts=true)",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `500 Internal Server Error`: Server error

#### GET /api/categories/:id
- **Description**: Retrieve a single category by ID
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Response Payload** (200 OK):
```json
{
  "category": {
    "id": "string",
    "name": "string",
    "userId": "string",
    "noteCount": "number",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this category
  - `404 Not Found`: Category not found
  - `500 Internal Server Error`: Server error

#### POST /api/categories
- **Description**: Create a new category
- **Headers**: `Authorization: Bearer <token>`
- **Request Payload**:
```json
{
  "name": "string (required, min: 1, max: 100, unique per user)"
}
```
- **Response Payload** (201 Created):
```json
{
  "message": "Category created successfully",
  "category": {
    "id": "string",
    "name": "string",
    "userId": "string",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid input data or validation errors
  - `401 Unauthorized`: Invalid or missing token
  - `409 Conflict`: Category name already exists for user
  - `500 Internal Server Error`: Server error

#### PUT /api/categories/:id
- **Description**: Update an existing category name
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Payload**:
```json
{
  "name": "string (required, min: 1, max: 100, unique per user)"
}
```
- **Response Payload** (200 OK):
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
- **Error Responses**:
  - `400 Bad Request`: Invalid input data or validation errors
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this category
  - `404 Not Found`: Category not found
  - `409 Conflict`: Category name already exists for user
  - `500 Internal Server Error`: Server error

#### DELETE /api/categories/:id
- **Description**: Delete a category (notes with this category will have categoryId set to null)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Response Payload** (200 OK):
```json
{
  "message": "Category deleted successfully",
  "notesUpdated": "number (count of notes that had categoryId set to null)"
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this category
  - `404 Not Found`: Category not found
  - `500 Internal Server Error`: Server error

### 2.5 Sharing Endpoints

#### POST /api/notes/:id/share
- **Description**: Share a note with another user
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Payload**:
```json
{
  "username": "string (required, recipient username)"
}
```
- **Response Payload** (200 OK):
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
- **Error Responses**:
  - `400 Bad Request`: Invalid input data or cannot share with self
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this note
  - `404 Not Found`: Note not found or recipient user not found
  - `409 Conflict`: Note already shared with this user
  - `500 Internal Server Error`: Server error

#### DELETE /api/notes/:id/share/:userId
- **Description**: Unshare a note with a specific user
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId, note ID)
  - `userId`: string (required, MongoDB ObjectId, user to unshare with)
- **Response Payload** (200 OK):
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
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `403 Forbidden`: User does not own this note
  - `404 Not Found`: Note not found or sharing relationship not found
  - `500 Internal Server Error`: Server error

#### GET /api/notes/shared
- **Description**: Retrieve all notes shared with the authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1, min: 1)
  - `limit`: number (default: 20, min: 1, max: 100)
  - `cursor`: string (optional, ISO 8601 datetime for cursor-based pagination)
- **Response Payload** (200 OK):
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
    "page": "number",
    "limit": "number",
    "hasMore": "boolean",
    "nextCursor": "string | null"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `400 Bad Request`: Invalid query parameters
  - `500 Internal Server Error`: Server error

### 2.6 Tags Endpoints

#### GET /api/tags
- **Description**: Retrieve all tags used by the authenticated user with usage counts
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `sortBy`: string (optional, "name" | "count", default: "name")
  - `sortOrder`: string (optional, "asc" | "desc", default: "asc")
- **Response Payload** (200 OK):
```json
{
  "tags": [
    {
      "name": "string",
      "count": "number"
    }
  ]
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing token
  - `500 Internal Server Error`: Server error

## 3. Authentication and Authorization

### 3.1 Authentication Mechanism
- **Method**: JWT (JSON Web Tokens) with Bearer token authentication
- **Token Storage**: HTTP-only cookies or Authorization header (Bearer token)
- **Token Expiration**: 24 hours (configurable)
- **Password Security**: 
  - Passwords hashed using bcryptjs with salt rounds of 10
  - Minimum password length: 8 characters
  - Passwords never returned in API responses

### 3.2 Authorization Rules
- **User Resources**: Users can only access their own resources (notes, categories)
- **Note Access**: 
  - Users can read, update, and delete only their own notes
  - Users can read notes shared with them (read-only access)
  - Users cannot modify notes shared with them
- **Category Access**: Users can only manage their own categories
- **Sharing**: Only note owners can share or unshare notes

### 3.3 Session Management
- **Session Storage**: Redis for session data and token blacklisting
- **Session Expiration**: Automatic logout after 24 hours of inactivity
- **Multiple Sessions**: Users can have multiple active sessions across devices
- **Logout**: Token invalidation stored in Redis with TTL matching token expiration

### 3.4 Security Headers
- **Helmet.js**: Security headers including X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **CORS**: Configured for specific frontend origins
- **Rate Limiting**: Applied to authentication endpoints and AI processing endpoints
- **Input Validation**: Joi schema validation for all request payloads
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Prevention**: Input sanitization using DOMPurify for text content

## 4. Validation and Business Logic

### 4.1 User Validation
- **Username**:
  - Required, unique across all users
  - Minimum length: 3 characters
  - Maximum length: 50 characters
  - Alphanumeric and underscore only
  - Case-insensitive uniqueness check
- **Password**:
  - Required
  - Minimum length: 8 characters
  - No maximum length (hashed storage)
  - Should contain at least one letter and one number (recommended, not enforced in MVP)

### 4.2 Note Validation
- **Content Text**:
  - Required field
  - Maximum length: 2000 words (word count validation)
  - Empty text allowed only if links or images are provided
- **Links**:
  - Optional array
  - Each link must be a valid URL format
  - Maximum 50 links per note
  - URLs are normalized and validated
- **Images**:
  - Optional array
  - Supported formats: JPG, PNG, GIF
  - Maximum file size: 10MB per image
  - Maximum 20 images per note
  - Images uploaded to cloud storage (AWS S3/Cloudinary)
  - Image metadata stored in note document
- **CategoryId**:
  - Optional
  - Must reference an existing category owned by the user
  - If provided and category doesn't exist, returns 404
- **Tags**:
  - Optional array
  - Each tag: 1-50 characters, alphanumeric and hyphens
  - Maximum 20 tags per note
  - Tags are normalized (lowercase, trimmed)
- **Version**:
  - Required for updates
  - Must match current document version for optimistic concurrency control
  - Version mismatch returns 409 Conflict

### 4.3 Category Validation
- **Name**:
  - Required
  - Minimum length: 1 character
  - Maximum length: 100 characters
  - Unique per user (case-insensitive)
  - Cannot be empty or whitespace only

### 4.4 Search Validation
- **Search Type**:
  - Required parameter
  - Must be one of: "date", "category", "keyword", "semantic"
- **Date Search**:
  - Requires both startDate and endDate
  - Dates must be valid ISO 8601 format
  - startDate must be before or equal to endDate
  - Date range cannot exceed 1 year
- **Category Search**:
  - Requires categoryId parameter
  - categoryId must reference an existing category owned by user
- **Keyword Search**:
  - Requires query parameter
  - Minimum query length: 1 character
  - Maximum query length: 200 characters
- **Semantic Search**:
  - Requires query parameter
  - Minimum query length: 3 characters
  - Maximum query length: 500 characters
  - Timeout: 60 seconds maximum

### 4.5 Sharing Validation
- **Username**:
  - Required
  - Must reference an existing user
  - Cannot share note with self
  - Cannot share the same note with the same user twice

### 4.6 Business Logic Implementation

#### 4.6.1 AI Content Analysis
- **Trigger**: Automatic after note creation or update (if content changed)
- **Process**:
  1. Note saved to MongoDB with `aiAnalysisStatus: "pending"`
  2. Background job queued using Bull Queue
  3. OpenAI API called to analyze content and generate:
     - Keywords (5-10 relevant keywords)
     - Suggested category (or confirmation of existing category)
  4. Vector embedding generated from note content
  5. Embedding stored in Qdrant with reference ID stored in note document
  6. Note updated with keywords, category, and vectorId
  7. Status updated to `aiAnalysisStatus: "completed"` or `"failed"`
- **Error Handling**:
  - If AI analysis fails, note remains saved without AI metadata
  - User can manually retry analysis via `/api/notes/:id/analyze` endpoint
  - Failed analysis attempts are logged for debugging
  - Rate limiting applied to prevent API abuse

#### 4.6.2 Automatic Categorization
- **Logic**: 
  - If user provides categoryId, use it
  - If no categoryId provided, AI suggests a category name
  - If suggested category exists for user, assign it
  - If suggested category doesn't exist, create new category automatically
  - User can change category manually after creation

#### 4.6.3 Keyword Generation
- **Logic**:
  - AI generates 5-10 keywords based on note content
  - Keywords are stored as an array in the note document
  - Keywords are used for keyword search functionality
  - Keywords are normalized (lowercase, trimmed)

#### 4.6.4 Semantic Search
- **Process**:
  1. User query converted to vector embedding using OpenAI
  2. Vector similarity search performed in Qdrant
  3. Results ranked by similarity score (0-1)
  4. Top results returned with relevance scores
  5. Maximum response time: 60 seconds
- **Optimization**:
  - Query embeddings cached in Redis for repeated queries
  - Results cached for 5 minutes
  - Pagination applied to large result sets

#### 4.6.5 Note Sharing
- **Logic**:
  - Sharing relationship stored as embedded array in note document
  - Shared notes appear in recipient's `/api/notes/shared` endpoint
  - Recipients have read-only access
  - Sharing metadata includes sharedByUserId and timestamp
  - When note is deleted, sharing relationships are automatically removed

#### 4.6.6 Optimistic Concurrency Control
- **Implementation**:
  - Each note document includes a `version` field (integer)
  - On update, client must provide current version
  - Server checks version matches before updating
  - If version mismatch, returns 409 Conflict
  - On successful update, version is incremented
  - Prevents lost updates in concurrent scenarios

#### 4.6.7 Pagination Strategy
- **Cursor-Based Pagination**:
  - Primary method for large datasets
  - Uses `createdAt` timestamp as cursor
  - More efficient than offset-based for large collections
  - Supports time period splitting for very large datasets
- **Offset-Based Pagination**:
  - Fallback for search endpoints
  - Uses `page` and `limit` parameters
  - Maximum limit: 100 items per page

#### 4.6.8 Image Processing
- **Upload Flow**:
  1. Image received via multipart/form-data or base64
  2. File validated (format, size)
  3. Image processed and optimized using Sharp
  4. Uploaded to cloud storage (AWS S3/Cloudinary)
  5. Metadata (URL, filename, size, mimeType) stored in note document
  6. Original file reference stored, not the file itself
- **Storage**:
  - Images stored externally, not in MongoDB
  - Only metadata stored in note documents
  - CDN URLs used for image delivery

#### 4.6.9 Category Deletion Handling
- **Logic**:
  - When category is deleted, all notes with that categoryId have categoryId set to null
  - Notes are not deleted, only category reference is removed
  - Returns count of affected notes in response

#### 4.6.10 Tag Management
- **Auto-Generation**: Tags can be AI-generated as part of keyword generation
- **Manual Management**: Users can add, remove, and search by tags
- **Normalization**: All tags stored in lowercase, trimmed
- **Aggregation**: Tag counts calculated dynamically from notes collection

