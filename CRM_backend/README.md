# CRM Backend API

Express.js REST API backend for CRM Lead Management System with MongoDB and JWT authentication.

## Features

- ✅ **JWT Authentication** - Secure token-based user authentication
- ✅ **Lead Management** - Create, read, update, delete leads
- ✅ **Notes System** - Add/delete notes on leads with author tracking
- ✅ **Dashboard Stats** - KPI aggregation with MongoDB aggregation pipeline
- ✅ **Advanced Filtering** - Search, filter, sort, and paginate leads
- ✅ **Error Handling** - Centralized error handler with proper HTTP status codes
- ✅ **Database Seeding** - Automatic initialization with test user and sample data
- ✅ **CORS Support** - Configured for frontend development

## Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud)
- npm or yarn

## Installation

```bash
cd CRM_backend
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## Project Structure

```
src/
├── app.js                      # Express app configuration
├── server.js                   # Server entry point
├── config/
│   └── db.js                   # MongoDB connection setup
├── models/
│   ├── User.model.js           # User schema (name, email, password, role)
│   └── Lead.model.js           # Lead schema with embedded notes
├── controllers/
│   ├── auth.controller.js      # Authentication logic
│   └── lead.controller.js      # Lead CRUD and operations
├── routes/
│   ├── auth.routes.js          # Auth endpoints
│   └── lead.routes.js          # Lead endpoints
├── middleware/
│   ├── auth.middleware.js      # JWT verification middleware
│   └── error.middleware.js     # Global error handler
├── services/
│   └── seed.service.js         # Database seeding
└── utils/
    ├── apiResponse.js          # Response helper functions
    └── asyncHandler.js         # Async error wrapper
```

## API Endpoints

### Authentication

| Method | Endpoint           | Description               | Auth |
| ------ | ------------------ | ------------------------- | ---- |
| POST   | `/api/auth/login`  | Login with email/password | ❌   |
| POST   | `/api/auth/logout` | Logout and clear token    | ✅   |
| GET    | `/api/auth/me`     | Get current user profile  | ✅   |

### Leads

| Method | Endpoint                       | Description                  | Auth |
| ------ | ------------------------------ | ---------------------------- | ---- |
| GET    | `/api/leads`                   | Get all leads (with filters) | ✅   |
| GET    | `/api/leads/stats`             | Get dashboard statistics     | ✅   |
| GET    | `/api/leads/:id`               | Get single lead              | ✅   |
| POST   | `/api/leads`                   | Create new lead              | ✅   |
| PUT    | `/api/leads/:id`               | Update lead                  | ✅   |
| DELETE | `/api/leads/:id`               | Delete lead                  | ✅   |
| POST   | `/api/leads/:id/notes`         | Add note to lead             | ✅   |
| DELETE | `/api/leads/:id/notes/:noteId` | Delete note                  | ✅   |

## Test Credentials

Default seed credentials (auto-created on first startup):

```
Email: admin@example.com
Password: password123
Role: Administrator
```

## Database Models

### User

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (lowercase)
  password: String,       // Bcrypt hashed password
  role: String,           // "Administrator" or "Sales"
  createdAt: Date,
  updatedAt: Date
}
```

### Lead

```javascript
{
  name: String,
  company: String,
  email: String,
  phone: String,
  source: String,         // "Website", "LinkedIn", "Cold Email", etc.
  salesperson: String,
  status: String,         // "New", "Contacted", "Qualified", etc.
  estimatedValue: Number,
  notes: [{
    content: String,
    author: String,
    createdAt: Date,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All errors return consistent JSON format:

**Success Response (200-201):**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response (4xx-5xx):**

```json
{
  "success": false,
  "message": "Error description"
}
```

## Code Quality

✅ Comprehensive JSDoc documentation
✅ Async error handling with wrapper
✅ Centralized error middleware
✅ Type-safe MongoDB operations
✅ Mongoose schema validation
✅ Security best practices (bcrypt, JWT, HTTP-only cookies)
✅ CORS protection
✅ Input validation

## Security Features

- ✅ Password hashing with bcryptjs (salt: 12 rounds)
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ CORS configured for whitelisted origins
- ✅ Request validation with Mongoose schemas
- ✅ Protected routes with auth middleware

## Performance Optimizations

- Database indexes on frequently queried fields
- MongoDB aggregation pipeline for stats
- Pagination support for leads list
- Efficient text search with regex
- Promise.all for parallel queries

## License

ISC
