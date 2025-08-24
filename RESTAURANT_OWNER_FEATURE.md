# Restaurant Owner Feature

## Overview

This feature allows users with the "owner" role to manage their restaurants through the dashboard.

## Features

### For Restaurant Owners:

1. **View My Restaurants**: See all restaurants owned by the current user
2. **Add New Restaurant**: Create new restaurants with name and location
3. **Edit Restaurant**: Update restaurant information (name and location)
4. **Delete Restaurant**: Remove restaurants from the platform
5. **View Restaurant Stats**: See average ratings and review status

### User Interface:

- **Dashboard Integration**: Restaurant management appears in the dashboard for owner users
- **Role-based Display**: Only users with "owner" role see the restaurant management section
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Consistent with the existing design system

## API Endpoints

### GET /restaurants/my-restaurants

- **Purpose**: Fetch restaurants owned by the current authenticated user
- **Authentication**: Required (owner role)
- **Response**: Array of restaurant objects with calculated ratings

### POST /restaurants

- **Purpose**: Create a new restaurant
- **Authentication**: Required (owner role)
- **Body**: `{ "name": "string", "location": "string" }`

### PUT /restaurants/:id

- **Purpose**: Update restaurant information
- **Authentication**: Required (owner role)
- **Body**: `{ "name": "string", "location": "string" }`

### DELETE /restaurants/:id

- **Purpose**: Delete a restaurant
- **Authentication**: Required (owner role)

## Components

### OwnerRestaurants.tsx

- Main component for restaurant management
- Handles CRUD operations for restaurants
- Displays restaurant list with edit/delete actions
- Form for adding/editing restaurants

### ProfileCard.tsx (Updated)

- Shows user role with appropriate icon
- Displays "owner" or "user" role indicator

### DashboardPage.tsx (Updated)

- Conditionally renders OwnerRestaurants component for owner users
- Maintains existing layout for regular users

## Database Schema

The feature uses the existing database schema:

- `User` model with `role` field
- `Restaurant` model with `owner_id` foreign key
- Proper relationships between users and restaurants

## Usage Example

```json
{
  "name": "Elgnany",
  "location": "Misr Elgdeda"
}
```

This will create a restaurant named "Elgnany" located in "Misr Elgdeda" owned by the current authenticated user.

## Security

- All endpoints require authentication
- Owner role verification on all restaurant management endpoints
- Users can only manage their own restaurants
- Proper input validation and sanitization
