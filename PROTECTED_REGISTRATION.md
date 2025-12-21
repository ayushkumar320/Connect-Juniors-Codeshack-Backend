# Protected Registration Guide

## 🔐 Secure Role-Based Registration

Your backend now has **secure registration endpoints** for different user roles:

### Registration Endpoints

#### 1️⃣ **Junior Registration** (Public)

```http
POST /api/users/register
```

**Anyone can register as a Junior** without a secret key.

**Request Body:**

```json
{
    "name": "Alice Junior",
    "email": "alice@example.com",
    "password": "password123",
    "bio": "Learning web development"
}
```

---

#### 2️⃣ **Mentor Registration** (Protected)

```http
POST /api/users/register-mentor
```

**Requires a secret key** to create mentor accounts.

**Request Body:**

```json
{
    "name": "Bob Mentor",
    "email": "bob@example.com",
    "password": "password123",
    "bio": "Senior developer with 10 years experience",
    "secretKey": "mentor_secret_key_change_in_production_2024"
}
```

**Note:** Mentor accounts are created but need **admin approval** before they can function as mentors.

---

#### 3️⃣ **Admin Registration** (Protected)

```http
POST /api/users/register-admin
```

**Requires a different secret key** to create admin accounts.

**Request Body:**

```json
{
    "name": "Charlie Admin",
    "email": "charlie@example.com",
    "password": "password123",
    "bio": "Platform administrator",
    "secretKey": "admin_super_secret_key_change_in_production_2024"
}
```

---

## 🔑 Secret Keys Configuration

The secret keys are stored in your `.env` file:

```env
# Secret Keys for Protected Registration
MENTOR_SECRET_KEY=mentor_secret_key_change_in_production_2024
ADMIN_SECRET_KEY=admin_super_secret_key_change_in_production_2024
```

### ⚠️ Security Best Practices

1. **Change these keys** before going to production
2. **Never commit** secret keys to version control (`.env` is in `.gitignore`)
3. **Share keys securely** with authorized personnel only
4. **Rotate keys periodically** for enhanced security

---

## 📋 Response Examples

### Success Response (Junior/Admin)

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "userId": "64a1b2c3d4e5f6a7b8c9d0e1",
        "name": "Alice Junior",
        "email": "alice@example.com",
        "role": "junior",
        "bio": "Learning web development"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Success Response (Mentor - Pending Approval)

```json
{
    "success": true,
    "message": "Mentor account created successfully. Awaiting admin approval.",
    "data": {
        "userId": "64a1b2c3d4e5f6a7b8c9d0e2",
        "name": "Bob Mentor",
        "email": "bob@example.com",
        "role": "mentor",
        "bio": "Senior developer",
        "isMentorApproved": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response (Invalid Secret Key)

```json
{
    "success": false,
    "message": "Invalid secret key for mentor registration",
    "code": "INVALID_SECRET_KEY"
}
```

---

## 🧪 Testing with Postman

### Create Junior (No Secret Key)

```bash
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Alice Junior",
  "email": "alice@example.com",
  "password": "password123",
  "bio": "Aspiring developer"
}
```

### Create Mentor (With Secret Key)

```bash
POST http://localhost:5000/api/users/register-mentor
Content-Type: application/json

{
  "name": "Bob Mentor",
  "email": "bob@example.com",
  "password": "password123",
  "bio": "Senior developer",
  "secretKey": "mentor_secret_key_change_in_production_2024"
}
```

### Create Admin (With Secret Key)

```bash
POST http://localhost:5000/api/users/register-admin
Content-Type: application/json

{
  "name": "Charlie Admin",
  "email": "charlie@example.com",
  "password": "password123",
  "bio": "Platform admin",
  "secretKey": "admin_super_secret_key_change_in_production_2024"
}
```

---

## 🔄 Workflow

### For Mentors:

1. Register with mentor secret key → Account created (not approved)
2. Admin reviews and approves → Mentor can now answer doubts
3. Create mentor profile with expertise tags

### For Admins:

1. Register with admin secret key → Account created (instantly active)
2. Access admin dashboard and functions
3. Approve/reject mentor applications

### For Juniors:

1. Register normally → Account created (instantly active)
2. Start posting doubts
3. Interact with mentors and community

---

## ✅ What Changed

### Before:

-   ❌ Anyone could register as "mentor" or "admin" without verification
-   ❌ No protection for privileged roles

### After:

-   ✅ Regular registration creates **Junior accounts only**
-   ✅ Mentor registration requires **MENTOR_SECRET_KEY**
-   ✅ Admin registration requires **ADMIN_SECRET_KEY**
-   ✅ Mentors need **admin approval** before they can function
-   ✅ Proper role-based access control

---

## 🛡️ Security Features

1. **Secret Key Validation**: Different keys for mentor and admin roles
2. **Environment Variables**: Keys stored securely in `.env`
3. **Approval Workflow**: Mentors require admin approval
4. **Role Restriction**: Regular registration can't create privileged roles
5. **Token Generation**: All successful registrations return JWT tokens

---

**Your backend is now secure with proper role-based registration! 🎉**
