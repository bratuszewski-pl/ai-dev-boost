# API Endpoint Implementation Plan: POST /api/notes/:id/analyze

## 1. Endpoint Overview

The POST /api/notes/:id/analyze endpoint manually triggers AI analysis for a note. This is useful for retrying failed analyses or re-analyzing notes after content updates. The endpoint queues an AI analysis job and returns immediately without waiting for completion.

**Key Functionality:**
- Manually trigger AI analysis for a note
- Verify user has access to note
- Queue AI analysis job in Bull Queue
- Apply rate limiting to prevent abuse
- Return immediate response

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/notes/:id/analyze`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (required)
- **URL Parameters**:
  - `id`: string (required, MongoDB ObjectId)
- **Request Body**: None

## 3. Types Used

### Response Types
- `AnalyzeNoteResponse` (from `common/models.ts`)
  - `message: string`
  - `noteId: string`
  - `status: AIAnalysisStatus`

## 4. Response Details

### Success Response (202 Accepted)
```json
{
  "message": "AI analysis queued",
  "noteId": "string",
  "status": "pending"
}
```

### Error Responses
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User does not have access to note
- **404 Not Found**: Note not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## 5. Data Flow

1. **Authentication & Authorization**
   - Verify JWT token
   - Extract userId

2. **Rate Limiting Check**
   - Check user's analysis request rate
   - Return 429 if limit exceeded

3. **Parameter Validation**
   - Validate note ID format

4. **Note Retrieval**
   - Query note by ID
   - Return 404 if not found

5. **Access Verification**
   - Verify user owns note OR note is shared with user
   - Return 403 if no access

6. **AI Analysis Job Queue**
   - Create Bull Queue job with note data
   - Set job priority and retry configuration
   - Handle queue errors

7. **Response Generation**
   - Return 202 Accepted with job status
   - Include noteId and status

## 6. Security Considerations

### Authentication & Authorization
- Require valid JWT token
- Verify note access

### Rate Limiting
- Limit analysis requests per user (e.g., 10 per hour)
- Prevent abuse of AI processing
- Track requests in Redis

### Resource Protection
- Prevent excessive AI API calls
- Monitor queue length
- Handle queue failures gracefully

## 7. Error Handling

### Authentication Errors (401)
- Invalid or missing token

### Authorization Errors (403)
- User does not have access

### Rate Limit Errors (429)
- "Too many analysis requests. Please try again later."

### Not Found Errors (404)
- Note not found

### Server Errors (500)
- Queue errors
- Database errors

## 8. Performance Considerations

### Queue Management
- Efficient job creation
- Monitor queue length
- Handle queue backpressure

### Rate Limiting
- Use Redis for rate limit tracking
- Efficient rate limit checks

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route with `analyzeNoteSchema`
   - Add authentication middleware

2. **Implement Rate Limiting**
   - Check user's request rate
   - Return 429 if exceeded

3. **Implement Note Retrieval**
   - Query note by ID
   - Check access

4. **Implement Job Queue**
   - Create Bull Queue job
   - Handle queue errors

5. **Implement Response Formatting**
   - Return 202 Accepted
   - Include job status

6. **Implement Error Handling**
   - Handle all error scenarios
   - Log errors

7. **Add Logging**
   - Log analysis requests
   - Log errors

8. **Write Integration Tests**
   - Test successful queueing
   - Test rate limiting
   - Test error scenarios

9. **Documentation**
   - Add JSDoc comments
   - Document error codes

