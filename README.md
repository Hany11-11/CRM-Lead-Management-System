# CRM Assessment - Customer Relationship Management System

A full-stack Customer Relationship Management (CRM) application designed for managing leads and tracking customer interactions. This project demonstrates a modern, scalable web application architecture with a robust backend API and an intuitive, responsive frontend.

---

## 📋 Project Overview

This CRM system provides organizations with comprehensive lead management capabilities, including:

- Secure user authentication and authorization
- Lead creation, tracking, and management
- Notes and interaction history for each lead
- Advanced filtering and search capabilities
- Dashboard with key performance indicators (KPIs) and analytics
- Responsive design for desktop and mobile devices

The application follows best practices in API design, security, state management, and component architecture.

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.6.1 with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs password hashing
- **Middleware**: CORS, Cookie Parser
- **Development**: Nodemon for hot-reloading
- **Error Handling**: Centralized error middleware with async handler wrapper

### Frontend

- **Framework**: React 19.2.5 with TypeScript
- **Build Tool**: Vite 8.0.10
- **Styling**: Tailwind CSS 4.2.4 with Vite plugin
- **Routing**: React Router DOM 7.14.2
- **HTTP Client**: Axios 1.16.0
- **Animation**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.14.0
- **Code Quality**: ESLint with TypeScript support
- **Component Structure**: Atomic Design Pattern (atoms, molecules, organisms, templates)

---

## ✨ Features Implemented

### Authentication & Security

- ✅ User registration and login with JWT authentication
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes with role-based access control
- ✅ Token-based session management with cookie storage
- ✅ CORS-enabled for secure cross-origin requests

### Lead Management

- ✅ Create, read, update, and delete (CRUD) operations for leads
- ✅ Lead status tracking (e.g., New, Contacted, Qualified, Converted)
- ✅ Lead assignment and ownership
- ✅ Advanced search and filtering capabilities
- ✅ Pagination and sorting for large datasets

### Interaction Tracking

- ✅ Notes system with timestamp and author tracking
- ✅ Add/delete notes on leads
- ✅ Notes timeline view for lead interaction history
- ✅ Note author attribution

### Dashboard & Analytics

- ✅ Dashboard overview with key metrics
- ✅ KPI aggregation using MongoDB aggregation pipeline
- ✅ Statistical cards displaying:
  - Total leads count
  - Leads by status distribution
  - Lead conversion rates
  - Other relevant metrics

### User Interface

- ✅ Responsive design for all screen sizes
- ✅ Atomic component design system
- ✅ Smooth animations with Framer Motion
- ✅ Dark mode support ready
- ✅ Protected dashboard accessible only to authenticated users
- ✅ Settings page for user preferences
- ✅ Professional data grid with sorting/filtering capabilities

### Developer Experience

- ✅ Full TypeScript support for type safety
- ✅ API error handling with standardized responses
- ✅ Automatic database seeding with test data
- ✅ Hot module reloading (HMR) in development
- ✅ ESLint configuration for code quality

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Local installation or cloud instance (MongoDB Atlas)
- **npm**: v9 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "CRM Assessment"
```

#### 2. Setup Backend

```bash
cd CRM_backend
npm install
```

Create a `.env` file in the `CRM_backend` directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_assessment
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend API will be running at `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd ../CRM_Frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be accessible at `http://localhost:5173`

### Development Commands

**Backend**:

- `npm run dev` - Start with nodemon (watch mode)
- `npm start` - Start production server

**Frontend**:

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

---

## 🔐 Environment Variables

### Backend (CRM_backend/.env)

| Variable     | Description                               | Example                                    |
| ------------ | ----------------------------------------- | ------------------------------------------ |
| `NODE_ENV`   | Environment mode                          | `development` or `production`              |
| `PORT`       | Express server port                       | `5000`                                     |
| `MONGO_URI`  | MongoDB connection string                 | `mongodb://localhost:27017/crm_assessment` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your_secure_random_string_here`           |
| `JWT_EXPIRE` | JWT token expiration time                 | `7d`                                       |
| `CLIENT_URL` | Frontend URL for CORS                     | `http://localhost:5173`                    |

### Frontend

The frontend uses environment variables through Vite's `.env` file (optional for development):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 👤 Test Login Credentials

### Default Test User (Auto-seeded)

**Email**: `admin@example.com`  
**Password**: `password123`

The database is automatically seeded with:

- One test user account
- Sample leads with various statuses
- Notes and interaction history

**Note**: Seeding occurs on first run if the database is empty. To reseed, clear the database and restart the server.

---

## 🗄️ Database Setup

### MongoDB Local Setup

#### Option 1: Local MongoDB Installation

```bash
# Windows - Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb

# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
```

Start MongoDB:

```bash
# Windows
mongod

# Linux/macOS
brew services start mongodb-community
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get the connection string
4. Update `MONGO_URI` in `.env`:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crm_db?retryWrites=true&w=majority
```

### Database Schema

**Users Collection**:

- `_id`: ObjectId
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String
- `createdAt`: Date
- `updatedAt`: Date

**Leads Collection**:

- `_id`: ObjectId
- `name`: String
- `email`: String
- `phone`: String
- `company`: String
- `status`: String (enum: New, Contacted, Qualified, Converted, Lost)
- `source`: String
- `notes`: Array of note objects
- `owner`: ObjectId (reference to User)
- `createdAt`: Date
- `updatedAt`: Date

### Manual Seeding

If you need to manually seed data:

```bash
curl -X POST http://localhost:5000/api/seed
```

---

## ⚠️ Known Limitations

1. **Single Tenant**: The system is designed for single-tenant use. Multi-tenant support would require additional database schema modifications and API middleware.

2. **Authentication Scope**: Authentication is implemented at the route level but lacks granular permission controls. Role-based access control (RBAC) would require additional implementation.

3. **Real-time Features**: The application does not include WebSocket support for real-time updates. Multiple users editing the same lead will not see live updates without page refresh.

4. **Bulk Operations**: Backend lacks bulk operations (bulk create, bulk delete) which would improve performance when handling large datasets.

5. **File Uploads**: No file attachment/upload functionality for leads or notes. Documents and media would require cloud storage integration (AWS S3, Cloudinary, etc.).

6. **Audit Trail**: Changes to leads are not tracked in an audit log. Cannot view who changed what and when.

7. **Email Notifications**: No email notification system for lead assignments, status changes, or new notes.

8. **Rate Limiting**: API endpoints lack rate limiting, making the system vulnerable to brute force attacks in production.

9. **API Documentation**: No Swagger/OpenAPI documentation. API endpoints are not self-documented.

10. **Testing**: No unit or integration tests implemented. Test coverage is 0%.

11. **Database Transactions**: Complex operations don't use transactions, which could lead to data inconsistency in concurrent scenarios.

12. **Search**: Search functionality is basic (string matching). Advanced full-text search or Elasticsearch integration not implemented.

---

## 💭 Reflection

### Strengths

- **Clean Architecture**: Separation of concerns with controllers, services, routes, and middleware
- **Modern Stack**: Using current versions of React, Express, and other libraries
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Type Safety**: TypeScript implementation reduces runtime errors
- **Component Reusability**: Atomic design pattern promotes code reuse
- **Error Handling**: Centralized error middleware with consistent error responses
- **User Authentication**: Secure JWT-based authentication with password hashing

### Areas for Improvement

- **Testing**: Implement comprehensive unit and integration tests (Jest, Supertest)
- **Documentation**: Add API documentation (Swagger/OpenAPI) for better DX
- **Performance**: Implement caching strategies (Redis), database indexing optimization
- **Scalability**: Move to microservices architecture for better scalability
- **Security Enhancements**:
  - Implement rate limiting
  - Add request validation with libraries like Joi or Zod
  - Implement CSRF protection
  - Add helmet.js for security headers
- **Observability**: Add logging (Winston, Morgan) and monitoring
- **CI/CD**: Implement GitHub Actions or similar for automated testing and deployment

### Learning Outcomes

This project demonstrates:

- Full-stack application development with modern technologies
- RESTful API design principles
- React patterns and hooks for state management
- MongoDB schema design and aggregation pipelines
- JWT-based authentication flow
- Component composition and reusability
- Responsive UI design principles
- Error handling and user feedback mechanisms

### If Building This Again

1. Start with comprehensive test suites (TDD approach)
2. Add API documentation from the beginning
3. Implement proper logging and monitoring
4. Use database transactions for complex operations
5. Add input validation on both frontend and backend
6. Implement caching strategies earlier
7. Design database schema with indexing in mind
8. Plan for multi-tenancy from the start if needed

---

## 📁 Project Structure

```
CRM Assessment/
├── CRM_backend/                 # Express.js API Server
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Server entry point
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Custom middleware
│   │   ├── services/           # Business logic
│   │   └── utils/              # Helper functions
│   ├── .env                    # Environment variables
│   └── package.json
│
└── CRM_Frontend/                # React + Vite App
    ├── src/
    │   ├── App.tsx             # Root component
    │   ├── main.tsx            # Entry point
    │   ├── components/         # UI components (atomic design)
    │   ├── pages/              # Page components
    │   ├── context/            # React Context for state
    │   ├── services/           # API calls
    │   ├── hooks/              # Custom React hooks
    │   ├── types/              # TypeScript type definitions
    │   └── utils/              # Utility functions
    ├── vite.config.ts          # Vite configuration
    ├── tsconfig.json           # TypeScript configuration
    ├── index.html              # HTML template
    └── package.json
```

---
