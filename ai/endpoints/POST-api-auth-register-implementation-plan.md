# API Endpoint Implementation Plan: POST /api/auth/register

## 1. Endpoint Overview

The POST /api/auth/register endpoint allows new users to create an account with a unique username and secure password. The endpoint validates input, checks username uniqueness, hashes the password, creates the user record in MongoDB, and returns user information without sensitive data.

**Key Functionality:**
- Validate username format and uniqueness
- Validate password strength
- Hash password using bcryptjs
- Create user record in MongoDB
- Return user information (excluding password)

## 2. Request Details

- **HTTP Method**: POST
- **URL Structure**: `/api/auth/register`
- **Headers**:
  - `Content-Type: application/json` (required)
- **Parameters**: None
- **Request Body**:
```typescript
{
  username: string (required, min: 3, max: 50, alphanumeric and underscore only, unique)
  password: string (required, min: 8 characters)
}
```

## 3. Types Used

### Request Types
- `RegisterRequest` (from `common/models.ts`)
  - `username: string`
  - `password: string`

### Response Types
- `RegisterResponse` (from `common/models.ts`)
  - `message: string`
  - `user: PublicUser`

### Internal Types
- `User` - Full user entity with hashed password
- `PublicUser` - User information without password

### Database Models (Prisma)
- `User` model with username (unique index), password (hashed), createdAt, updatedAt

## 4. Response Details

### Success Response (201 Created)
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

### Error Responses
- **400 Bad Request**: Invalid input data or validation errors
- **409 Conflict**: Username already exists
- **500 Internal Server Error**: Server error during registration

## 5. Data Flow

1. **Request Validation**
   - Validate request body against `registerSchema` (Fastify JSON Schema)
   - Validate username format (alphanumeric and underscore, 3-50 chars)
   - Validate password length (minimum 8 characters)
   - Normalize username (lowercase for uniqueness check)

2. **Username Uniqueness Check**
   - Query MongoDB using Prisma to check if username exists
   - Use case-insensitive comparison
   - Return 409 Conflict if username exists

3. **Password Hashing**
   - Hash password using bcryptjs with salt rounds of 10
   - Store hashed password (never store plain text)

4. **User Creation**
   - Generate MongoDB ObjectId for user
   - Create user document with:
     - username (normalized)
     - password (hashed)
     - createdAt, updatedAt (current timestamp)
   - Insert into MongoDB using Prisma
   - Create unique index on username if not exists

5. **Response Generation**
   - Format user object according to `PublicUser` type (exclude password)
   - Return 201 Created status with user data

## 6. Security Considerations

### Input Validation
- Validate username pattern (alphanumeric and underscore only)
- Enforce minimum password length (8 characters)
- Normalize username to prevent case-sensitivity issues
- Sanitize input to prevent injection attacks

### Password Security
- Hash passwords using bcryptjs with salt rounds of 10
- Never store plain text passwords
- Never return password in response
- Never log passwords

### Username Uniqueness
- Case-insensitive uniqueness check
- Use database unique index for enforcement
- Handle race conditions with proper error handling

### Rate Limiting
- Implement rate limiting to prevent brute force registration attempts
- Limit to reasonable number of registrations per IP (e.g., 5 per hour)

### Data Protection
- Use HTTPS for all requests
- Never expose sensitive user data
- Log registration events without sensitive information

## 7. Error Handling

### Validation Errors (400 Bad Request)
- **Invalid username format**: "Username must be 3-50 characters, alphanumeric and underscore only"
- **Username too short**: "Username must be at least 3 characters"
- **Username too long**: "Username must be at most 50 characters"
- **Invalid password length**: "Password must be at least 8 characters"
- **Missing username**: "Username is required"
- **Missing password**: "Password is required"

### Conflict Errors (409 Conflict)
- **Username exists**: "Username already exists"

### Server Errors (500 Internal Server Error)
- **Database connection error**: Log error, return generic message
- **Password hashing error**: Log error, return generic message
- **Unexpected errors**: Log full error details, return generic message

### Error Logging
- Use Winston logger for structured logging
- Log all errors with:
  - Error message and stack trace
  - Username (sanitized)
  - Timestamp and request ID
  - Error severity level
- Never log passwords or sensitive data

## 8. Performance Considerations

### Database Optimization
- Use Prisma connection pooling
- Create unique index on username for efficient lookups
- Use case-insensitive index or normalization for username queries

### Password Hashing
- bcryptjs is CPU-intensive; consider async hashing
- Use appropriate salt rounds (10 is recommended balance)
- Consider using bcrypt native bindings for better performance

### Caching Strategy
- Consider caching username existence checks (short TTL: 1 minute)
- Use Redis for rate limiting tracking

### Response Optimization
- Minimize response payload size
- Use compression (gzip) for responses
- Optimize JSON serialization

## 9. Implementation Steps

1. **Setup Route Handler**
   - Create route file: `backend/routes/auth.ts`
   - Import Fastify instance and required plugins
   - Import `registerSchema` from `backend/schemas.ts`
   - Import types from `common/models.ts`

2. **Create Auth Service**
   - Create service file: `backend/services/auth-service.ts`
   - Implement `registerUser` method with proper error handling
   - Inject Prisma client and bcrypt

3. **Implement Request Validation**
   - Use Fastify schema validation (automatic via `registerSchema`)
   - Add custom validators for:
     - Username format validation
     - Password strength validation
   - Normalize username (lowercase)

4. **Implement Username Uniqueness Check**
   - Create `checkUsernameExists` method in auth service
   - Query MongoDB using Prisma with case-insensitive comparison
   - Return boolean result

5. **Implement Password Hashing**
   - Use bcryptjs to hash password
   - Use salt rounds of 10
   - Handle hashing errors gracefully

6. **Implement User Creation**
   - Create user document structure
   - Set initial values (username normalized, password hashed)
   - Insert into MongoDB using Prisma
   - Handle unique constraint violations

7. **Implement Response Formatting**
   - Format user object according to `PublicUser` type
   - Exclude password field
   - Set proper HTTP status code (201)

8. **Implement Error Handling**
   - Create error handler utility
   - Map errors to appropriate HTTP status codes
   - Format error responses according to schema
   - Log errors using Winston

9. **Add Rate Limiting**
   - Implement rate limiting middleware
   - Configure limits per IP
   - Return 429 status when exceeded

10. **Add Logging**
    - Log successful registrations with userId
    - Log validation errors with details
    - Log database errors
    - Never log passwords

11. **Write Integration Tests**
    - Test successful registration
    - Test validation errors
    - Test username uniqueness
    - Test password hashing
    - Test error scenarios

12. **Documentation**
    - Add JSDoc comments to all functions
    - Document error codes and messages
    - Update API documentation

