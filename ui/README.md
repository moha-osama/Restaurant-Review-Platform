# Restaurant Review Platform - UI

A modern React application for discovering and reviewing restaurants, built with TailwindCSS and modern React patterns.

## Features

- **Authentication System**: Login and signup forms with TanStack Form
- **Restaurant Discovery**: Browse restaurants with search and filtering
- **Interactive Map**: View restaurant locations (placeholder implementation)
- **User Dashboard**: Manage profile and review history
- **Responsive Design**: Mobile-first design with TailwindCSS

## Tech Stack

- **React 19** with TypeScript
- **TailwindCSS v4** for styling
- **TanStack Query** for data fetching
- **TanStack Form** for form handling
- **React Router** for navigation
- **React Icons** for iconography

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   ├── RestaurantCard.tsx # Restaurant display card
│   └── Map.tsx         # Map component (placeholder)
├── pages/              # Page components
│   ├── AuthPage.tsx    # Login/Signup page
│   ├── RestaurantsPage.tsx # Main restaurants listing
│   └── DashboardPage.tsx   # User dashboard
├── App.tsx             # Main app component with routing
└── index.css           # TailwindCSS and custom styles
```

## Color Palette

The app uses a custom TailwindCSS color palette:

- **Selective Yellow**: Primary brand color (#FEB505)
- **Wheat**: Secondary accent color (#E3CAA0)
- **White Smoke**: Text and neutral colors (#F3F4F4)
- **Timberwolf**: Border and muted colors (#D4D4D0)
- **Floral White**: Background color (#FFFCF5)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Pages

### Auth Page (`/auth`)
- Toggle between login and signup forms
- Form validation with TanStack Form
- Responsive design with TailwindCSS

### Restaurants Page (`/`)
- Left panel: Restaurant cards with search and filtering
- Right panel: Interactive map showing selected restaurant
- Responsive grid layout

### Dashboard Page (`/dashboard`)
- User profile information
- Review history with edit/delete options
- Clean card-based layout

## Components

### RestaurantCard
- Displays restaurant image, name, rating, and description
- Clickable with hover effects
- Star rating display

### Map
- Placeholder implementation for restaurant locations
- Shows selected restaurant information
- Ready for integration with Leaflet.js or Google Maps

### Navbar
- Responsive navigation with logo
- Links to all main pages
- Clean, modern design

## Styling

- **TailwindCSS v4** for utility-first styling
- Custom color palette defined in `tailwind.config.js`
- Reusable component classes in `index.css`
- Responsive design with mobile-first approach
- Soft shadows and rounded corners throughout

## Future Enhancements

- Integration with real backend API
- Leaflet.js or Google Maps integration
- User authentication state management
- Restaurant review submission forms
- Advanced filtering and sorting options
- User profile image upload
- Real-time updates and notifications

## Development Notes

- Uses React 19 features and patterns
- TanStack Query for server state management
- TanStack Form for form handling
- TypeScript for type safety
- ESLint for code quality
- Vite for fast development and building
