# API Endpoint Implementation Plan: POST /api/auth/login

## 1. Endpoint Overview

The POST /api/auth/login endpoint authenticates users by validating their username and password credentials. Upon successful authentication, it generates a JWT token, stores session information in Redis, and returns the token along with user information. The endpoint implements secure password verification and session management.

**Key Functionality:**
- Validate username and password
- Verify password against hashed password in database
- Generate JWT token with user information
- Store session in Redis for token blacklisting
- Return JWT token and user information

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/auth/login`
- **Headers**:
  - `Content-Type: application/json` (required)
- **Parameters**: None
- **Request Body**:
```typescript
{
  username: string (required)
  password: string (required)
}
```

## 3. Types Used

### Request Types
- `LoginRequest` (from `common/models.ts`)
  - `username: string`
  - `password: string`

### Response Types
- `LoginResponse` (from `common/models.ts`)
  - `message: string`
  - `token: string`
  - `user: { id: string, username: string }`

### Internal Types
- `User` - Full user entity with hashed password
- `JWTPayload` - JWT token payload structure

### Database Models (Prisma)
- `User` model with username, password (hashed)

## 4. Response Details

### Success Response (200 OK)
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

### Error Responses
- **400 Bad Request**: Missing username or password
- **401 Unauthorized**: Invalid credentials
- **500 Internal Server Error**: Server error during authentication

## 5. Data Flow

1. **Request Validation**
   - Validate request body against `loginSchema` (Fastify JSON Schema)
   - Ensure username and password are provided
   - Normalize username (lowercase)

2. **User Lookup**
   - Query MongoDB using Prisma to find user by username
   - Use case-insensitive username lookup
   - Return 401 if user not found

3. **Password Verification**
   - Compare provided password with hashed password using bcryptjs
   - Use `bcrypt.compare()` for secure comparison
   - Return 401 if password doesn't match

4. **JWT Token Generation**
   - Create JWT payload with:
     - userId
     - username
     - iat (issued at timestamp)
     - exp (expiration timestamp, 24 hours)
   - Sign token using JWT secret
   - Set token expiration to 24 hours

5. **Session Storage**
   - Store session information in Redis
   - Key format: `session:${userId}:${tokenId}`
   - Set TTL to match token expiration (24 hours)
   - Store user ID and token metadata

6. **Response Generation**
   - Format response according to `LoginResponse` type
   - Include JWT token
   - Include user information (id, username only)
   - Return 200 OK status

## 6. Security Considerations

### Authentication
- Verify password using bcryptjs compare (timing-safe)
- Never return detailed error messages about which field is wrong
- Use generic "Invalid credentials" message for security

### Password Security
- Never store plain text passwords
- Use secure password comparison (bcrypt.compare)
- Implement rate limiting to prevent brute force attacks

### JWT Security
- Use strong JWT secret (environment variable)
- Set appropriate token expiration (24 hours)
- Include minimal information in JWT payload
- Use HTTPS for token transmission

### Session Management
- Store sessions in Redis for token blacklisting
- Implement token refresh mechanism (if needed)
- Handle token expiration gracefully

### Rate Limiting
- Implement rate limiting to prevent brute force attacks
- Limit login attempts per IP (e.g., 5 per 15 minutes)
- Lock account after multiple failed attempts (optional)

### Data Protection
- Use HTTPS for all requests
- Never log passwords or tokens
- Sanitize user input

## 7. Error Handling

### Validation Errors (400 Bad Request)
- **Missing username**: "Username is required"
- **Missing password**: "Password is required"
- **Invalid input format**: "Invalid request format"

### Authentication Errors (401 Unauthorized)
- **Invalid credentials**: "Invalid username or password" (generic message)
- **User not found**: "Invalid username or password" (generic message)
- **Password mismatch**: "Invalid username or password" (generic message)

### Server Errors (500 Internal Server Error)
- **Database connection error**: Log error, return generic message
- **Password verification error**: Log error, return generic message
- **JWT generation error**: Log error, return generic message
- **Redis connection error**: Log error, return generic message
- **Unexpected errors**: Log full error details, return generic message

### Error Logging
- Use Winston logger for structured logging
- Log all errors with:
  - Error message and stack trace
  - Username (sanitized)
  - Timestamp and request ID
  - Error severity level
- Never log passwords or tokens
- Log failed login attempts for security monitoring

## 8. Performance Considerations

### Database Optimization
- Use Prisma connection pooling
- Create index on username for efficient lookups
- Use case-insensitive index or normalization

### Password Verification
- bcrypt.compare is CPU-intensive but necessary for security
- Consider async operations for better concurrency
- Use appropriate bcrypt configuration

### JWT Generation
- JWT signing is fast, but consider caching for high traffic
- Use efficient JWT library (jsonwebtoken)

### Redis Session Storage
- Use Redis connection pooling
- Set appropriate TTL for session data
- Consider Redis cluster for high availability

### Caching Strategy
- Consider caching user lookups (short TTL: 1 minute)
- Use Redis for rate limiting tracking

### Response Optimization
- Minimize response payload size
- Use compression (gzip) for responses
- Optimize JSON serialization

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route file: `backend/routes/auth.ts`
   - Import Fastify instance and required plugins
   - Import `loginSchema` from `backend/schemas.ts`
   - Import types from `common/models.ts`

2. **Create Auth Service**
   - Create service file: `backend/services/auth-service.ts`
   - Implement `loginUser` method with proper error handling
   - Inject Prisma client, bcrypt, JWT, and Redis client

3. **Implement Request Validation**
   - Use Fastify schema validation (automatic via `loginSchema`)
   - Validate username and password are provided
   - Normalize username (lowercase)

4. **Implement User Lookup**
   - Create `findUserByUsername` method in auth service
   - Query MongoDB using Prisma with case-insensitive comparison
   - Return user or null

5. **Implement Password Verification**
   - Use bcryptjs.compare to verify password
   - Handle comparison errors gracefully
   - Return boolean result

6. **Implement JWT Generation**
   - Create `generateToken` method in auth service
   - Use jsonwebtoken library
   - Set appropriate expiration (24 hours)
   - Sign with JWT secret from environment

7. **Implement Session Storage**
   - Create `storeSession` method in auth service
   - Store session in Redis with TTL
   - Handle Redis errors gracefully

8. **Implement Response Formatting**
   - Format response according to `LoginResponse` type
   - Include JWT token
   - Include user information (exclude password)
   - Set proper HTTP status code (200)

9. **Implement Error Handling**
   - Create error handler utility
   - Map errors to appropriate HTTP status codes
   - Use generic error messages for security
   - Format error responses according to schema
   - Log errors using Winston

10. **Add Rate Limiting**
    - Implement rate limiting middleware
    - Configure limits per IP (5 attempts per 15 minutes)
    - Return 429 status when exceeded
    - Track failed attempts

11. **Add Logging**
    - Log successful logins with userId
    - Log failed login attempts (for security monitoring)
    - Log validation errors
    - Log authentication errors
    - Never log passwords or tokens

12. **Write Integration Tests**
    - Test successful login
    - Test validation errors
    - Test invalid credentials
    - Test user not found
    - Test password mismatch
    - Test error scenarios

13. **Documentation**
    - Add JSDoc comments to all functions
    - Document error codes and messages
    - Update API documentation

