# CRM Lead Management System - Frontend

A modern, full-featured CRM application for managing sales leads, tracking pipeline progress, and managing customer interactions.

## Project Overview

This is a React-based frontend for a Lead Management System designed for small to mid-sized sales teams. It provides an intuitive interface for managing leads, tracking deal progress, adding notes, and viewing comprehensive sales metrics.

## Tech Stack

- **Frontend Framework**: React 19.2.5
- **Language**: TypeScript 6.0.2
- **Build Tool**: Vite 8.0.10
- **Styling**: Tailwind CSS 4.2.4
- **Routing**: React Router DOM 7.14.2
- **Animations**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.14.0
- **State Management**: React Context API

## Features Implemented

### ✅ Authentication

- Email/password login system
- Test user credentials: `admin@example.com` / `password123`
- Protected routes - CRM only accessible after login
- Session persistence using localStorage
- Logout functionality

### ✅ Lead Management (CRUD)

- **Create**: Add new leads with full details
- **Read**: View leads in list and detail pages with complete information
- **Update**: Edit lead information and status
- **Delete**: Remove leads from the system
- **Lead Fields**:
  - Lead Name, Company Name, Email, Phone Number
  - Lead Source (Website, LinkedIn, Cold Email, Referral, Conference, Other)
  - Assigned Salesperson
  - Status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
  - Estimated Deal Value
  - Created/Updated timestamps

### ✅ Dashboard

Displays 8 KPI cards showing:

1. **Total Leads** - Total number of leads in system
2. **New Leads** - Count of leads in 'New' status
3. **Qualified Leads** - Count of leads in 'Qualified' status
4. **Won Deals** - Count of successfully closed deals
5. **Lost Leads** - Count of lost opportunities
6. **Pipeline Value** - Total estimated value of all deals
7. **Won Value** - Total value of closed deals
8. **Conversion Rate** - Percentage of leads converted to deals
9. Recent leads displayed in card format with quick actions

### ✅ Lead Notes & Timeline

- Add notes to leads with author and timestamp
- View complete note timeline on lead detail page
- Delete notes
- Notes automatically sorted by newest first
- Each note tracks: content, author, and creation date

### ✅ Search & Filtering

- **Search**: By lead name, company, or email
- **Filter by Status**: New, Contacted, Qualified, Proposal Sent, Won, Lost
- **Filter by Lead Source**: Website, LinkedIn, Cold Email, Referral, Conference, Other
- **Filter by Salesperson**: Filter leads assigned to specific salespeople
- **Sortable Columns**: Click headers to sort by name, company, status, value, or date

### ✅ Lead Details Page

- Complete lead information display
- Status advancement flow: New → Contacted → Qualified → Proposal Sent → Won
- Edit and delete functionality
- Full note timeline with add/delete capabilities
- Lead activity history with days in pipeline

### ✅ UI/UX Features

- Professional Tailwind CSS design
- Smooth Framer Motion animations
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Real-time data updates
- Color-coded status badges
- Avatar indicators for salespeople
- Intuitive navigation with breadcrumbs

## Project Structure

```
CRM_Frontend/
├── src/
│   ├── components/
│   │   ├── atoms/              # Basic reusable components
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Typography.tsx
│   │   │   └── index.ts
│   │   ├── molecules/          # Composite components
│   │   │   ├── FilterDropdown.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── NoteItem.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── index.ts
│   │   ├── organisms/          # Complex components
│   │   │   ├── DashboardStatsGrid.tsx
│   │   │   ├── LeadDataGrid.tsx
│   │   │   ├── LeadFormModal.tsx
│   │   │   ├── NoteTimeline.tsx
│   │   │   ├── SidebarNavigation.tsx
│   │   │   └── index.ts
│   │   ├── templates/          # Page layouts
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── context/                # React Context (State Management)
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── LeadContext.tsx     # Lead data state
│   ├── pages/                  # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LeadListPage.tsx
│   │   ├── LeadDetailsPage.tsx
│   │   └── index.ts
│   ├── types/                  # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   └── helpers.ts
│   ├── hooks/                  # Custom React hooks
│   │   └── useLeads.ts
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── index.html
```

## How to Run Locally

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
cd CRM_Frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Application will auto-reload on code changes

### Build for Production

```bash
npm run build
```

### Run linter

```bash
npm run lint
```

## Environment Variables

Currently, the application uses hardcoded test credentials and localStorage for data persistence. No environment variables are required.

**Test User Credentials:**

- Email: `admin@example.com`
- Password: `password123`

For future backend integration, the following env vars should be added:

```
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_PROVIDER=jwt
```

## Data Persistence

Currently, data is persisted using browser's localStorage:

- All leads are stored in: `localStorage.crm_leads`
- Authentication session stored in: `localStorage.crm_auth`
- Data survives page refresh and browser restart

**Note**: Data will be cleared if browser cache is cleared.

## Component Architecture

The project follows **Atomic Design Pattern**:

- **Atoms**: Basic UI elements (Button, Input, Badge, Avatar, Typography)
- **Molecules**: Simple component combinations (FormField, StatCard, SearchInput)
- **Organisms**: Complex features (LeadDataGrid, LeadFormModal, NoteTimeline)
- **Templates**: Page layouts (AuthLayout, DashboardLayout)
- **Pages**: Full page components using templates and organisms

## Key Features Explained

### Lead Status Pipeline

- **New**: Recently added lead, no contact yet
- **Contacted**: Initial contact made
- **Qualified**: Lead met qualification criteria
- **Proposal Sent**: Proposal/quote sent to prospect
- **Won**: Deal closed successfully
- **Lost**: Opportunity lost to competitor or no interest

### Lead Sources

Tracks where leads originated from:

- Website (form submissions)
- LinkedIn (social selling)
- Cold Email (outbound campaigns)
- Referral (customer referrals)
- Conference (event attendees)
- Other

### Dashboard Metrics

All metrics update in real-time as leads are added/modified:

- Trends compare current period to previous month
- Color-coded cards for quick visualization
- Sortable and filterable lead list with bulk actions

## Known Limitations

1. **No Backend**: Currently uses localStorage only. No server-side persistence.
2. **Single User**: No multi-user support - all data shared across browser sessions.
3. **No Real Authentication**: Login uses hardcoded credentials.
4. **No Email Integration**: No email sending or CRM inbox features.
5. **No File Uploads**: Cannot attach documents to leads.
6. **Limited Reporting**: Basic dashboard only - no advanced analytics.
7. **No API**: All data stays on client-side.

## Testing Credentials

**Test User:**

- Email: `admin@example.com`
- Password: `password123`

**Sample Data:**

- 9+ mock leads pre-loaded with realistic data
- Multiple salespeople and lead sources
- Various lead statuses showing full pipeline

## Future Enhancements (Bonus Features)

Potential improvements for production:

1. Backend API with Node.js/Express
2. PostgreSQL/MongoDB database
3. JWT token-based authentication
4. Real-time email notifications
5. Lead scoring algorithm
6. Kanban board view for pipeline
7. Advanced reporting and analytics
8. Calendar/task management
9. Mobile app version
10. CRM integration (HubSpot, Salesforce sync)
11. AI-powered lead suggestions
12. Bulk import/export capabilities

## Reflection

### What Went Well

- Component architecture is clean and maintainable
- TypeScript provides excellent type safety
- Tailwind CSS made styling efficient
- Context API handles state management well for this scale
- UI/UX is professional and intuitive
- Mock data provides good testing baseline

### Challenges Faced

- Managing complex state across multiple components
- Ensuring consistency when filtering/sorting simultaneously
- CSS responsive design across all screen sizes

### What I Learned

- Importance of proper component hierarchy
- How Context API can replace Redux for simpler apps
- TypeScript benefits for large projects
- Framer Motion for smooth animations
- Atomic design pattern benefits

### If I Had More Time

1. Would build complete backend with Node.js/Express
2. Add PostgreSQL database for persistence
3. Implement JWT authentication
4. Add more advanced filtering options
5. Create kanban board view
6. Add email integration
7. Build comprehensive reporting
8. Add user management and permissions

## Troubleshooting

**Issue: Data not persisting**

- Solution: Check if localStorage is enabled in browser settings

**Issue: Styles not loading**

- Solution: Clear browser cache and run `npm run dev` again

**Issue: Types error in IDE**

- Solution: Ensure TypeScript version is compatible, run `npm install`

## License

This project is created for assessment purposes.

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Frontend Complete - Ready for Backend Integration
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
