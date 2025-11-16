# API Endpoint Implementation Plan: POST /api/notes

## 1. Endpoint Overview

The POST /api/notes endpoint allows authenticated users to create new notes with text content, links, and images. Upon creation, the system automatically triggers AI-powered content analysis to generate keywords, suggest categories, and create vector embeddings for semantic search. The endpoint handles image uploads, validates content constraints, and queues background jobs for AI processing.

**Key Functionality:**
- Create notes with text, links, and images
- Validate content (max 2000 words, URL format, image constraints)
- Associate notes with categories (optional)
- Apply user-defined tags (optional)
- Trigger asynchronous AI analysis via Bull Queue
- Store note metadata in MongoDB
- Upload images to cloud storage (AWS S3/Cloudinary)

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/notes`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
  - `Content-Type: application/json` (required)
- **Parameters**: None
- **Request Body**:
```typescript
{
  content: {
    text: string (required, max: 2000 words)
    links?: string[] (optional, valid URLs, max: 50 items)
    images?: string[] (optional, base64 or file references, max: 20 items)
  }
  categoryId?: string (optional, MongoDB ObjectId)
  tags?: string[] (optional, max: 20 items, 1-50 chars each, alphanumeric and hyphens)
}
```

## 3. Types Used

### Request Types
- `CreateNoteRequest` (from `common/models.ts`)
  - `content: NoteContentRequest`
  - `categoryId?: ObjectId`
  - `tags?: string[]`

### Response Types
- `CreateNoteResponse` (from `common/models.ts`)
  - `message: string`
  - `note: Note`

### Internal Types
- `Note` - Full note entity with all fields
- `NoteContent` - Processed note content structure
- `ImageMetadata` - Image information after upload
- `AIAnalysisStatus` - Enum: 'pending' | 'completed' | 'failed'

### Database Models (Prisma)
- `Note` model with embedded content structure
- `Category` model for category validation
- `User` model for authentication

## 4. Response Details

### Success Response (201 Created)
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
    "categoryName": "string | null",
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

### Error Responses
- **400 Bad Request**: Invalid input data, validation errors, or content exceeds 2000 words
- **401 Unauthorized**: Invalid or missing JWT token
- **404 Not Found**: Category not found (if categoryId provided)
- **413 Payload Too Large**: Image file size exceeds limit (10MB per image)
- **500 Internal Server Error**: Server error during processing

## 5. Data Flow

1. **Authentication & Authorization**
   - Extract JWT token from Authorization header
   - Verify token validity and extract userId
   - Validate user exists in database

2. **Request Validation**
   - Validate request body against `createNoteSchema` (Fastify JSON Schema)
   - Validate content.text is not empty (or links/images provided)
   - Count words in content.text (max 2000 words)
   - Validate URLs in links array (format and accessibility)
   - Validate image data (format, size limits)
   - Normalize tags (lowercase, trim, validate pattern)

3. **Category Validation** (if categoryId provided)
   - Query MongoDB to verify category exists
   - Verify category belongs to authenticated user
   - Retrieve category name for response

4. **Image Processing** (if images provided)
   - Decode base64 images or process file references
   - Validate image format (JPG, PNG, GIF)
   - Validate file size (max 10MB per image)
   - Process and optimize images using Sharp
   - Upload to cloud storage (AWS S3/Cloudinary)
   - Generate image metadata (URL, filename, mimeType, size)
   - Store metadata in note document

5. **Note Creation**
   - Generate MongoDB ObjectId for note
   - Create note document with:
     - userId (from JWT)
     - content (text, links, processed image metadata)
     - categoryId (if provided)
     - tags (normalized array)
     - keywords (empty array, populated by AI)
     - vectorId (null, populated by AI)
     - version (1)
     - aiAnalysisStatus ('pending')
     - createdAt, updatedAt (current timestamp)
   - Insert note into MongoDB using Prisma
   - Create compound index on (userId, createdAt) if not exists

6. **AI Analysis Queue**
   - Create Bull Queue job for AI analysis
   - Job payload: noteId, content.text, userId
   - Set job priority and retry configuration
   - Return immediately without waiting for AI processing

7. **Response Generation**
   - Format note object according to response schema
   - Include all note fields with current state
   - Return 201 Created status with note data

## 6. Security Considerations

### Authentication
- JWT token validation via `@fastify/jwt` plugin
- Token expiration check (24 hours)
- Token blacklist check in Redis (for logged-out users)

### Authorization
- Verify userId from JWT matches authenticated user
- Validate category ownership if categoryId provided
- Ensure user cannot create notes for other users

### Input Validation
- Sanitize text content using DOMPurify to prevent XSS
- Validate URL format and protocol (http/https only)
- Validate image MIME types (whitelist: image/jpeg, image/png, image/gif)
- Enforce file size limits (10MB per image, 200MB total)
- Validate ObjectId format for categoryId
- Normalize and validate tag patterns (alphanumeric and hyphens only)

### Data Protection
- Never expose password hashes or sensitive user data
- Store images externally (not in MongoDB)
- Use HTTPS for all image uploads
- Implement rate limiting (per user and per IP)

### SQL Injection Prevention
- Use Prisma ORM with parameterized queries
- Never concatenate user input into queries
- Validate all ObjectId parameters

### XSS Prevention
- Sanitize all text content before storage
- Escape HTML in responses
- Use Content Security Policy headers

## 7. Error Handling

### Validation Errors (400 Bad Request)
- **Empty content**: "Content text, links, or images must be provided"
- **Word count exceeded**: "Note content cannot exceed 2000 words"
- **Invalid URL format**: "Invalid URL format in links array"
- **Invalid image format**: "Image must be JPG, PNG, or GIF"
- **Image size exceeded**: "Image size cannot exceed 10MB"
- **Invalid tag format**: "Tags must be alphanumeric with hyphens, 1-50 characters"
- **Too many tags**: "Maximum 20 tags allowed"
- **Too many links**: "Maximum 50 links allowed"
- **Too many images**: "Maximum 20 images allowed"

### Authentication Errors (401 Unauthorized)
- **Missing token**: "Authentication token required"
- **Invalid token**: "Invalid or expired authentication token"
- **Token format error**: "Invalid token format"

### Not Found Errors (404 Not Found)
- **Category not found**: "Category not found or does not belong to user"

### Payload Too Large (413 Payload Too Large)
- **Image size exceeded**: "Image file size exceeds 10MB limit"
- **Total payload exceeded**: "Total request payload exceeds size limit"

### Server Errors (500 Internal Server Error)
- **Database connection error**: Log error, return generic message
- **Image upload failure**: Log error, return generic message
- **Queue job creation failure**: Log error, return generic message
- **Unexpected errors**: Log full error details, return generic message

### Error Logging
- Use Winston logger for structured logging
- Log all errors with:
  - Error message and stack trace
  - User ID and request details
  - Timestamp and request ID
  - Error severity level
- Never log sensitive data (passwords, tokens)

## 8. Performance Considerations

### Database Optimization
- Use Prisma connection pooling
- Create compound index: `{ userId: 1, createdAt: -1 }` for efficient queries
- Use MongoDB transactions for atomic operations (if needed)
- Batch image metadata inserts

### Image Processing
- Process images asynchronously if possible
- Use Sharp for efficient image optimization
- Implement image compression before upload
- Use CDN for image delivery (Cloudinary/AWS CloudFront)
- Consider image lazy loading in responses

### AI Analysis Queue
- Use Bull Queue with Redis for background processing
- Set appropriate job priorities
- Implement job retry logic with exponential backoff
- Monitor queue length and processing time
- Consider rate limiting AI API calls

### Caching Strategy
- Cache category lookups in Redis (TTL: 5 minutes)
- Cache user authentication status (TTL: 1 minute)
- Consider caching note creation patterns

### Response Optimization
- Minimize response payload size
- Use compression (gzip) for responses
- Consider pagination for large note lists
- Optimize JSON serialization

### Rate Limiting
- Implement per-user rate limiting (e.g., 100 notes per hour)
- Implement per-IP rate limiting for image uploads
- Use Redis for rate limit tracking
- Return 429 Too Many Requests when exceeded

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route file: `backend/routes/notes.ts`
   - Import Fastify instance and required plugins
   - Import `createNoteSchema` from `backend/schemas.ts`
   - Import types from `common/models.ts`

2. **Create Note Service**
   - Create service file: `backend/services/note-service.ts`
   - Implement `createNote` method with proper error handling
   - Inject Prisma client, image service, and queue service

3. **Implement Authentication Middleware**
   - Verify JWT token in route preHandler
   - Extract userId from token payload
   - Attach user to request object for use in handler

4. **Implement Request Validation**
   - Use Fastify schema validation (automatic via `createNoteSchema`)
   - Add custom validators for:
     - Word count validation (2000 words max)
     - URL format validation
     - Image format and size validation
   - Normalize tags (lowercase, trim, validate pattern)

5. **Implement Category Validation**
   - Create `validateCategory` method in note service
   - Query MongoDB using Prisma to check category exists
   - Verify category ownership
   - Return category name for response

6. **Implement Image Processing Service**
   - Create service file: `backend/services/image-service.ts`
   - Implement `processAndUploadImages` method
   - Use Sharp for image processing
   - Upload to AWS S3 or Cloudinary
   - Return image metadata array

7. **Implement Note Creation**
   - Create note document structure
   - Set initial values (version: 1, aiAnalysisStatus: 'pending')
   - Insert into MongoDB using Prisma
   - Handle database errors gracefully

8. **Implement AI Analysis Queue**
   - Create queue service: `backend/services/queue-service.ts`
   - Configure Bull Queue with Redis connection
   - Create job for AI analysis with noteId and content
   - Set job options (priority, retry, delay)

9. **Implement Response Formatting**
   - Format note object according to `CreateNoteResponse` type
   - Include all required fields
   - Set proper HTTP status code (201)

10. **Implement Error Handling**
    - Create error handler utility
    - Map errors to appropriate HTTP status codes
    - Format error responses according to schema
    - Log errors using Winston

11. **Add Logging**
    - Log successful note creation with noteId
    - Log validation errors with details
    - Log image processing errors
    - Log queue job creation status

12. **Add Rate Limiting**
    - Implement rate limiting middleware
    - Configure limits per user and per IP
    - Return 429 status when exceeded

13. **Write Integration Tests**
    - Test successful note creation
    - Test validation errors
    - Test authentication errors
    - Test category validation
    - Test image processing
    - Test error scenarios

14. **Documentation**
    - Add JSDoc comments to all functions
    - Document error codes and messages
    - Update API documentation

15. **Performance Testing**
    - Test with various payload sizes
    - Test concurrent requests
    - Monitor database query performance
    - Monitor image processing time
    - Monitor queue job creation time

