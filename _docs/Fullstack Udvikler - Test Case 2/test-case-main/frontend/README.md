# User Management System

A modern React application built with TypeScript and PrimeReact, featuring a comprehensive user data table with search, sorting, and pagination capabilities.

## Features

- **Modern UI**: Built with PrimeReact components and styled-components for a professional look
- **TypeScript**: Full type safety and better development experience
- **Full-Page Layout**: Sidebar navigation with full-height data table
- **Sidebar Navigation**: Professional admin panel with active/disabled states
- **Data Table**: Advanced table with sorting, filtering, and pagination
- **Search**: Global search across all user fields
- **Styled Components**: CSS-in-JS styling for better component encapsulation
- **Responsive**: Mobile-friendly design

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **PrimeReact** - Rich UI component library
- **Styled Components** - CSS-in-JS styling solution
- **Create React App** - Zero-configuration setup
- **CSS3** - Custom styling with responsive design

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **Yarn** (v4.x preferred) or npm
- **Backend API** running (see [../backend/README.md](../backend/README.md))

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Configure API endpoint (optional):
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Edit the API URL if different from default
   echo "REACT_APP_API_URL=http://localhost:3000" > .env.local
   ```

4. Start the development server:
   ```bash
   yarn start
   # or
   npm start
   ```

5. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

> **Note**: Make sure the backend API is running at `http://localhost:3000` before starting the frontend.

## Available Scripts

In the project directory, you can run:

### `yarn start` / `npm start`

Runs the app in development mode at [http://localhost:3001](http://localhost:3001).
The page will reload if you make edits.

### `yarn test` / `npm test`

Launches the test runner in interactive watch mode.

### `yarn build` / `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn lint` / `npm run lint`

Runs ESLint to check for code quality issues.

### `yarn lint-fix` / `npm run lint-fix`

Runs ESLint with auto-fix to resolve fixable issues.

### `yarn eject` / `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Application Features

### Sidebar Navigation
- **Admin Panel**: Professional sidebar with logo and branding
- **Navigation Links**: Dashboard, Users, Products, Orders, Analytics, Settings
- **Active State**: Users link is highlighted as active
- **Disabled States**: Other links are disabled for demo purposes
- **Hover Effects**: Interactive hover states for better UX

### User Data Table
- **Full-Page Layout**: Table takes up the full available space
- **Columns**: ID, Name, Email, Phone, Company, City, Website, Actions
- **Sorting**: Click column headers to sort data
- **Global Search**: Search across all fields simultaneously
- **Pagination**: Navigate through data with customizable page sizes (10, 15, 25, 50)
- **Actions**: Styled circular edit and delete buttons for each user
- **Loading State**: Shows loading indicator while data is being fetched
- **Sticky Header**: Table header remains visible while scrolling
- **Enhanced Styling**: Professional styling with styled-components

## Customization

### Adding New Columns

1. Update the `User` interface in `src/types/User.ts`
2. Add data fields in `UserDataTable.tsx`
3. Add new `Column` components in the DataTable

### Styling

- Modify `src/App.css` for global styles
- PrimeReact theme can be changed by importing different theme CSS files
- Component-specific styles can be added using PrimeReact's className props

## 🔗 Backend Integration

This frontend application is designed to work with the NestJS backend API located in `../backend`.

### API Configuration
- **Default API URL**: `http://localhost:3000`
- **Environment Variable**: `REACT_APP_API_URL`
- **Fallback**: Uses JSONPlaceholder if backend is unavailable

### Features Integration
- **User Management**: Full CRUD operations via REST API
- **File Import**: Direct upload to `/api/v1/users/import` endpoint
- **Real-time Updates**: React Query handles caching and synchronization
- **Error Handling**: Graceful fallback to mock data when API is unavailable

### Development Setup
1. Start the backend API first (`cd ../backend && yarn start:dev`)
2. Start the frontend (`yarn start`)
3. Both applications support hot reloading

## Learn More
- [React Documentation](https://reactjs.org/)
- [PrimeReact Documentation](https://primefaces.org/primereact/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
