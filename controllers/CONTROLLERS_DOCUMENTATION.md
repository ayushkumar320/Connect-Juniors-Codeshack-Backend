# CodeShack Backend Controllers Documentation

## Overview

This document provides comprehensive documentation for all controllers in the CodeShack Junior Guidance Platform backend. Controllers are organized by feature and handle all business logic for the application.

---

## Table of Contents

1. [User Controller](#user-controller)
2. [Doubt Controller](#doubt-controller)
3. [Answer Controller](#answer-controller)
4. [Comment Controller](#comment-controller)
5. [Upvote Controller](#upvote-controller)
6. [Mentor Profile Controller](#mentor-profile-controller)
7. [Junior Space Post Controller](#junior-space-post-controller)
8. [Admin Controller](#admin-controller)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

---

## User Controller

**File:** `controllers/user.controller.js`

Handles all user-related operations including authentication, profile management, and user listings.

### Endpoints

#### 1. Register User
```
POST /api/users/register
```
- **Description:** Register a new user with role selection
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "junior|mentor" (optional, default: junior),
    "bio": "string" (optional)
  }
  ```
- **Response:** User object with JWT token
- **Status Codes:** 201 (Created), 409 (Conflict - email exists), 500 (Server Error)

#### 2. Login User
```
POST /api/users/login
```
- **Description:** Authenticate user and return JWT token
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User object with JWT token
- **Status Codes:** 200 (OK), 401 (Unauthorized), 500 (Server Error)

#### 3. Get User Profile
```
GET /api/users/:userId
```
- **Description:** Fetch detailed user profile (password hash excluded)
- **Parameters:** userId (MongoDB ObjectId)
- **Response:** User object without passwordHash
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 4. Update User Profile
```
PATCH /api/users/:userId
```
- **Description:** Update user profile information
- **Request Body:**
  ```json
  {
    "name": "string" (optional),
    "bio": "string" (optional)
  }
  ```
- **Response:** Updated user object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 5. Get All Mentors
```
GET /api/users/mentors/approved
```
- **Description:** Fetch all approved mentor accounts with pagination
- **Query Parameters:**
  - page: number (default: 1)
  - limit: number (default: 10)
  - sortBy: string (default: createdAt)
- **Response:** Array of mentor objects with pagination metadata
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 6. Get Users by Role
```
GET /api/users/role/:role
```
- **Description:** Fetch users filtered by role
- **Parameters:** role (junior, mentor, admin)
- **Query Parameters:** page, limit
- **Response:** Array of users with pagination
- **Status Codes:** 200 (OK), 400 (Invalid role), 404 (Not Found), 500 (Server Error)

#### 7. Delete User
```
DELETE /api/users/:userId
```
- **Description:** Delete user account
- **Parameters:** userId (MongoDB ObjectId)
- **Response:** Success message with deleted userId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 8. Change Password
```
POST /api/users/:userId/change-password
```
- **Description:** Change user password
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:** Success message
- **Status Codes:** 200 (OK), 401 (Invalid password), 404 (Not Found), 500 (Server Error)

---

## Doubt Controller

**File:** `controllers/doubt.controller.js`

Manages all doubt (Q&A) related operations.

### Endpoints

#### 1. Create Doubt
```
POST /api/doubts/user/:userId
```
- **Description:** Post a new doubt/question
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "tags": ["string", ...]
  }
  ```
- **Response:** Created doubt object
- **Status Codes:** 201 (Created), 404 (User not found), 500 (Server Error)
- **Note:** Tags are automatically converted to lowercase

#### 2. Get Doubt by ID
```
GET /api/doubts/:doubtId
```
- **Description:** Fetch doubt with all associated answers
- **Parameters:** doubtId (MongoDB ObjectId)
- **Response:** Doubt object with populated answers array
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 3. Get All Doubts
```
GET /api/doubts
```
- **Description:** Fetch all doubts with filtering and pagination
- **Query Parameters:**
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: "open|answered|resolved|closed" (optional)
  - tags: string or array (optional, case-insensitive)
  - sortBy: string (default: createdAt)
- **Response:** Array of doubts with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 4. Update Doubt
```
PATCH /api/doubts/:doubtId
```
- **Description:** Update doubt details
- **Request Body:**
  ```json
  {
    "title": "string" (optional),
    "description": "string" (optional),
    "tags": ["string", ...] (optional),
    "status": "open|answered|resolved|closed" (optional)
  }
  ```
- **Response:** Updated doubt object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 5. Delete Doubt
```
DELETE /api/doubts/:doubtId
```
- **Description:** Delete doubt and associated answers/comments
- **Parameters:** doubtId (MongoDB ObjectId)
- **Response:** Success message with deleted doubtId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)
- **Note:** Cascade deletes all answers and comments

#### 6. Get Doubts by User
```
GET /api/doubts/user/:userId
```
- **Description:** Fetch all doubts posted by a specific user
- **Parameters:** userId (MongoDB ObjectId)
- **Query Parameters:** page, limit
- **Response:** Array of user's doubts with pagination
- **Status Codes:** 200 (OK), 404 (User not found), 500 (Server Error)

#### 7. Get Doubts by Tag
```
GET /api/doubts/tag/:tag
```
- **Description:** Fetch doubts filtered by tag
- **Parameters:** tag (string, case-insensitive)
- **Query Parameters:** page, limit
- **Response:** Array of doubts with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 8. Get Doubt Statistics
```
GET /api/doubts/stats/overview
```
- **Description:** Fetch aggregated doubt statistics
- **Response:**
  ```json
  {
    "total": number,
    "byStatus": {
      "open": number,
      "answered": number,
      "resolved": number,
      "closed": number
    },
    "topTags": [
      {
        "_id": "tag",
        "count": number
      },
      ...
    ]
  }
  ```
- **Status Codes:** 200 (OK), 500 (Server Error)

---

## Answer Controller

**File:** `controllers/answer.controller.js`

Handles answer creation, management, and retrieval.

### Endpoints

#### 1. Create Answer
```
POST /api/answers/:doubtId/mentor/:mentorId
```
- **Description:** Post an answer to a doubt (mentors only)
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Response:** Created answer object
- **Status Codes:** 201 (Created), 403 (Not a mentor), 404 (Doubt/User not found), 500 (Server Error)
- **Note:** Automatically updates doubt status from "open" to "answered"

#### 2. Get Answers by Doubt
```
GET /api/answers/:doubtId
```
- **Description:** Fetch all answers to a doubt with pagination
- **Query Parameters:**
  - page: number (default: 1)
  - limit: number (default: 10)
  - sortBy: "upvoteCount|createdAt" (default: upvoteCount)
- **Response:** Array of answers with pagination
- **Status Codes:** 200 (OK), 404 (Doubt not found), 500 (Server Error)

#### 3. Get Answer by ID
```
GET /api/answers/:answerId
```
- **Description:** Fetch single answer with mentor and doubt details
- **Parameters:** answerId (MongoDB ObjectId)
- **Response:** Answer object with populated relations
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 4. Update Answer
```
PATCH /api/answers/:answerId
```
- **Description:** Update answer content
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Response:** Updated answer object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 5. Delete Answer
```
DELETE /api/answers/:answerId
```
- **Description:** Delete answer and associated upvotes
- **Parameters:** answerId (MongoDB ObjectId)
- **Response:** Success message with deleted answerId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)
- **Note:** Cascade deletes all upvotes

#### 6. Get Answers by Mentor
```
GET /api/answers/mentor/:mentorId
```
- **Description:** Fetch all answers posted by a mentor
- **Parameters:** mentorId (MongoDB ObjectId)
- **Query Parameters:** page, limit
- **Response:** Array of mentor's answers with pagination
- **Status Codes:** 200 (OK), 404 (Mentor not found), 500 (Server Error)

#### 7. Get Most Helpful Answers
```
GET /api/answers/helpful/top
```
- **Description:** Fetch answers sorted by upvote count
- **Query Parameters:** limit (default: 10)
- **Response:** Array of most helpful answers
- **Status Codes:** 200 (OK), 500 (Server Error)

---

## Comment Controller

**File:** `controllers/comment.controller.js`

Manages comments and threaded discussions on doubts.

### Endpoints

#### 1. Create Comment
```
POST /api/comments/:doubtId/user/:userId
```
- **Description:** Post a comment on a doubt (with optional reply support)
- **Request Body:**
  ```json
  {
    "content": "string",
    "parentCommentId": "string" (optional, for replies)
  }
  ```
- **Response:** Created comment object with user details
- **Status Codes:** 201 (Created), 404 (Doubt/User/Parent not found), 500 (Server Error)

#### 2. Get Comments by Doubt
```
GET /api/comments/:doubtId
```
- **Description:** Fetch threaded comments for a doubt
- **Query Parameters:** page (default: 1), limit (default: 20)
- **Response:** Array of top-level comments with replies nested
- **Status Codes:** 200 (OK), 404 (Doubt not found), 500 (Server Error)

#### 3. Get Comment by ID
```
GET /api/comments/:commentId
```
- **Description:** Fetch single comment with replies
- **Parameters:** commentId (MongoDB ObjectId)
- **Response:** Comment object with replies array
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 4. Update Comment
```
PATCH /api/comments/:commentId
```
- **Description:** Update comment content
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Response:** Updated comment object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 5. Delete Comment
```
DELETE /api/comments/:commentId
```
- **Description:** Delete comment and all child replies
- **Parameters:** commentId (MongoDB ObjectId)
- **Response:** Success message with deleted commentId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)
- **Note:** Cascade deletes all replies

#### 6. Get Replies
```
GET /api/comments/:commentId/replies
```
- **Description:** Fetch all replies to a comment
- **Query Parameters:** page, limit
- **Response:** Array of replies with pagination
- **Status Codes:** 200 (OK), 404 (Comment not found), 500 (Server Error)

#### 7. Get Comments by User
```
GET /api/comments/user/:userId
```
- **Description:** Fetch all comments posted by a user
- **Parameters:** userId (MongoDB ObjectId)
- **Query Parameters:** page, limit
- **Response:** Array of user's comments with pagination
- **Status Codes:** 200 (OK), 404 (User not found), 500 (Server Error)

---

## Upvote Controller

**File:** `controllers/upvote.controller.js`

Handles answer upvoting and voting statistics.

### Endpoints

#### 1. Upvote Answer
```
POST /api/upvotes/:answerId
```
- **Description:** Upvote an answer (prevents duplicate upvotes)
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Response:** Updated upvoteCount and upvoteId
- **Status Codes:** 201 (Created), 404 (Answer/User not found), 409 (Already upvoted), 500 (Server Error)

#### 2. Remove Upvote
```
DELETE /api/upvotes/:answerId
```
- **Description:** Remove upvote from answer
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Response:** Updated upvoteCount
- **Status Codes:** 200 (OK), 404 (Upvote not found), 500 (Server Error)

#### 3. Get Upvotes by Answer
```
GET /api/upvotes/:answerId
```
- **Description:** Fetch all users who upvoted an answer
- **Query Parameters:** page, limit
- **Response:** Array of upvotes with user details and pagination
- **Status Codes:** 200 (OK), 404 (Answer not found), 500 (Server Error)

#### 4. Get Upvotes by User
```
GET /api/upvotes/user/:userId
```
- **Description:** Fetch all answers upvoted by a user
- **Parameters:** userId (MongoDB ObjectId)
- **Query Parameters:** page, limit
- **Response:** Array of upvoted answers with pagination
- **Status Codes:** 200 (OK), 404 (User not found), 500 (Server Error)

#### 5. Check if Upvoted
```
GET /api/upvotes/:answerId/check/:userId
```
- **Description:** Check if user has upvoted an answer
- **Parameters:** answerId, userId
- **Response:**
  ```json
  {
    "isUpvoted": boolean
  }
  ```
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 6. Get Upvote Statistics
```
GET /api/upvotes/stats/overview
```
- **Description:** Fetch upvoting statistics
- **Response:**
  ```json
  {
    "totalUpvotes": number,
    "topAnswers": [...]
  }
  ```
- **Status Codes:** 200 (OK), 500 (Server Error)

---

## Mentor Profile Controller

**File:** `controllers/mentorProfile.controller.js`

Manages mentor profile information and approvals.

### Endpoints

#### 1. Create Mentor Profile
```
POST /api/mentor-profiles/:userId
```
- **Description:** Create mentor profile after mentor account signup
- **Request Body:**
  ```json
  {
    "badge": "string" (optional, default: "Mentor"),
    "expertiseTags": ["string", ...]
  }
  ```
- **Response:** Created mentor profile object
- **Status Codes:** 201 (Created), 403 (Not a mentor), 404 (User not found), 409 (Profile exists), 500 (Server Error)

#### 2. Get Mentor Profile
```
GET /api/mentor-profiles/:userId
```
- **Description:** Fetch mentor profile with answer count
- **Parameters:** userId (MongoDB ObjectId)
- **Response:** Mentor profile with user details and answersCount
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 3. Update Mentor Profile
```
PATCH /api/mentor-profiles/:userId
```
- **Description:** Update mentor profile information
- **Request Body:**
  ```json
  {
    "badge": "string" (optional),
    "expertiseTags": ["string", ...] (optional)
  }
  ```
- **Response:** Updated mentor profile
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 4. Get All Approved Mentors
```
GET /api/mentor-profiles/approved
```
- **Description:** Fetch all admin-approved mentors
- **Query Parameters:**
  - page: number (default: 1)
  - limit: number (default: 10)
  - sortBy: string (default: totalUpvotes)
- **Response:** Array of approved mentors with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 5. Get Pending Mentor Approvals
```
GET /api/mentor-profiles/pending/approvals
```
- **Description:** Fetch mentors awaiting admin approval
- **Query Parameters:** page, limit
- **Response:** Array of pending mentors with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 6. Get Mentors by Expertise
```
GET /api/mentor-profiles/expertise/:tag
```
- **Description:** Fetch mentors with specific expertise
- **Parameters:** tag (case-insensitive)
- **Query Parameters:** page, limit
- **Response:** Array of mentors sorted by upvotes with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 7. Get Top Mentors
```
GET /api/mentor-profiles/top/mentors
```
- **Description:** Fetch mentors ranked by upvote count
- **Query Parameters:** limit (default: 10)
- **Response:** Array of top mentors
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 8. Delete Mentor Profile
```
DELETE /api/mentor-profiles/:userId
```
- **Description:** Delete mentor profile
- **Parameters:** userId (MongoDB ObjectId)
- **Response:** Success message with userId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

---

## Junior Space Post Controller

**File:** `controllers/juniorSpacePost.controller.js`

Manages junior safe space posts and discussions.

### Endpoints

#### 1. Create Post
```
POST /api/junior-space/:juniorId
```
- **Description:** Post in junior safe space
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Response:** Created post with user details
- **Status Codes:** 201 (Created), 404 (User not found), 500 (Server Error)

#### 2. Get All Posts
```
GET /api/junior-space
```
- **Description:** Fetch all junior space posts
- **Query Parameters:** page (default: 1), limit (default: 10)
- **Response:** Array of posts with pagination
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 3. Get Post by ID
```
GET /api/junior-space/:postId
```
- **Description:** Fetch single junior space post
- **Parameters:** postId (MongoDB ObjectId)
- **Response:** Post object with user details
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 4. Update Post
```
PATCH /api/junior-space/:postId
```
- **Description:** Update post content
- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Response:** Updated post object
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 5. Delete Post
```
DELETE /api/junior-space/:postId
```
- **Description:** Delete junior space post
- **Parameters:** postId (MongoDB ObjectId)
- **Response:** Success message with deleted postId
- **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error)

#### 6. Get Posts by User
```
GET /api/junior-space/user/:juniorId
```
- **Description:** Fetch all posts by a specific junior
- **Parameters:** juniorId (MongoDB ObjectId)
- **Query Parameters:** page, limit
- **Response:** Array of user's posts with pagination
- **Status Codes:** 200 (OK), 404 (User not found), 500 (Server Error)

#### 7. Get Recent Posts
```
GET /api/junior-space/recent/feed
```
- **Description:** Fetch recent posts for feed
- **Query Parameters:** limit (default: 20)
- **Response:** Array of recent posts
- **Status Codes:** 200 (OK), 500 (Server Error)

#### 8. Get Junior Space Statistics
```
GET /api/junior-space/stats/overview
```
- **Description:** Fetch junior space statistics
- **Response:**
  ```json
  {
    "totalPosts": number,
    "totalPosters": number,
    "postsPerDay": [...]
  }
  ```
- **Status Codes:** 200 (OK), 500 (Server Error)

---

## Admin Controller

**File:** `controllers/admin.controller.js`

Handles admin operations and moderation tasks.

### Endpoints

#### 1. Approve Mentor
```
POST /api/admin/:adminId/approve-mentor
```
- **Description:** Admin approves pending mentor
- **Request Body:**
  ```json
  {
    "mentorUserId": "string"
  }
  ```
- **Response:** Success message with mentor and action IDs
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Profile not found), 500 (Server Error)

#### 2. Reject Mentor
```
POST /api/admin/:adminId/reject-mentor
```
- **Description:** Admin rejects and deletes mentor profile
- **Request Body:**
  ```json
  {
    "mentorUserId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Profile not found), 500 (Server Error)

#### 3. Delete Doubt (Admin)
```
POST /api/admin/:adminId/delete-doubt
```
- **Description:** Admin removes inappropriate doubt
- **Request Body:**
  ```json
  {
    "doubtId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Not found), 500 (Server Error)
- **Note:** Cascade deletes associated answers and comments

#### 4. Delete Answer (Admin)
```
POST /api/admin/:adminId/delete-answer
```
- **Description:** Admin removes inappropriate answer
- **Request Body:**
  ```json
  {
    "answerId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Not found), 500 (Server Error)

#### 5. Delete Comment (Admin)
```
POST /api/admin/:adminId/delete-comment
```
- **Description:** Admin removes inappropriate comment
- **Request Body:**
  ```json
  {
    "commentId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Not found), 500 (Server Error)
- **Note:** Cascade deletes replies

#### 6. Delete Junior Post (Admin)
```
POST /api/admin/:adminId/delete-junior-post
```
- **Description:** Admin removes inappropriate junior space post
- **Request Body:**
  ```json
  {
    "postId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (Not found), 500 (Server Error)

#### 7. Ban User
```
POST /api/admin/:adminId/ban-user
```
- **Description:** Admin bans user from platform
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (User not found), 500 (Server Error)

#### 8. Unban User
```
POST /api/admin/:adminId/unban-user
```
- **Description:** Admin unbans previously banned user
- **Request Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Response:** Success message with action ID
- **Status Codes:** 200 (OK), 403 (Not admin), 404 (User not found), 500 (Server Error)

#### 9. Get Admin Actions
```
GET /api/admin/:adminId/actions
```
- **Description:** Fetch admin's action history
- **Query Parameters:**
  - page: number (default: 1)
  - limit: number (default: 20)
  - actionType: string (optional, filters by action type)
- **Response:** Array of admin actions with pagination
- **Status Codes:** 200 (OK), 403 (Not admin), 500 (Server Error)

#### 10. Get Admin Statistics
```
GET /api/admin/:adminId/stats
```
- **Description:** Fetch admin's action statistics
- **Response:**
  ```json
  {
    "totalActions": number,
    "actionBreakdown": [...]
  }
  ```
- **Status Codes:** 200 (OK), 403 (Not admin), 500 (Server Error)

---

## Error Handling

### Standard Error Response Format

All endpoints return errors in consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "error": "Detailed error information"
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| USER_NOT_FOUND | 404 | User does not exist |
| DOUBT_NOT_FOUND | 404 | Doubt/Question does not exist |
| ANSWER_NOT_FOUND | 404 | Answer does not exist |
| COMMENT_NOT_FOUND | 404 | Comment does not exist |
| PROFILE_NOT_FOUND | 404 | Mentor profile does not exist |
| POST_NOT_FOUND | 404 | Junior space post does not exist |
| UPVOTE_NOT_FOUND | 404 | Upvote record does not exist |
| EMAIL_EXISTS | 409 | Email already registered |
| DUPLICATE_EMAIL | 409 | Email already in use |
| ALREADY_UPVOTED | 409 | User already upvoted this answer |
| PROFILE_EXISTS | 409 | Mentor profile already exists |
| INVALID_CREDENTIALS | 401 | Invalid email or password |
| INVALID_PASSWORD | 401 | Current password is incorrect |
| INVALID_ROLE | 400 | Invalid user role specified |
| UNAUTHORIZED | 403 | User unauthorized for action |

---

## Best Practices

### 1. Input Validation
- All inputs validated through Zod schemas at middleware layer
- Controllers assume data is valid
- Never trust client input

### 2. Error Handling
- Try-catch blocks in all endpoints
- Proper HTTP status codes used
- Meaningful error messages returned
- No sensitive information exposed

### 3. Database Operations
- Use `.lean()` for read-only queries to improve performance
- Use `.populate()` judiciously to avoid N+1 queries
- Always validate resource existence before operations
- Use transactions for multi-document updates when needed

### 4. Authentication
- JWT token required for protected endpoints
- Token validation at middleware level
- Role-based access control enforced
- Admin-only actions explicitly checked

### 5. Pagination
- Consistent pagination across all list endpoints
- Default limit: 10-20 items
- Total count always returned
- Page numbers start from 1

### 6. Data Consistency
- Cascade deletions implemented where needed
- Relationships maintained (populate references)
- Timestamps tracked (createdAt, updatedAt)
- Status updates reflected immediately

### 7. Performance
- Indexes used on frequently queried fields
- Lean queries for read-only operations
- Aggregation pipelines for statistics
- Sorting optimized with indexed fields

### 8. Response Format
- Consistent response structure
- `success` boolean always included
- `message` human-readable
- `data` contains actual payload
- `code` for error identification

---

## Integration Notes

### Middleware Requirements
- Authentication middleware for protected routes
- Validation middleware using Zod schemas
- Error handling middleware globally

### Environment Variables
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRY` - Token expiration time (default: 7d)
- `MONGODB_URI` - Database connection string
- `PORT` - Server port

### Database Indexes
Ensure these indexes exist in MongoDB:
- `User`: email (unique), role
- `Doubt`: juniorId, status, tags, createdAt
- `Answer`: doubtId, mentorId, upvoteCount
- `Comment`: doubtId, userId, parentCommentId
- `Upvote`: (userId, answerId) unique
- `MentorProfile`: userId (unique)
- `AdminAction`: adminId, createdAt
- `JuniorSpacePost`: juniorId, createdAt

---

## Testing Recommendations

### Unit Tests
- Test each controller method independently
- Mock database operations
- Verify error handling

### Integration Tests
- Test full request/response cycle
- Use test database
- Verify cascade operations

### Load Tests
- Test pagination with large datasets
- Monitor query performance
- Check for N+1 query problems

---

## Version History

- **v1.0.0** - Initial controller implementation
  - All CRUD operations for entities
  - Role-based access control
  - Cascade deletions
  - Statistics and aggregation endpoints

---

**Last Updated:** 2025-12-20
**Maintainer:** Backend Team
**Contact:** development@codeshack.io

