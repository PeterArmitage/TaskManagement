# Task Management System

A modern task management application with a responsive UI, authentication, and comprehensive task management features.

## Features

- **User Authentication**: Secure JWT-based login and registration
- **Task Management**: Create, edit, delete, and filter tasks
- **Task Details**: Add comments, checklist items, and labels to tasks
- **Dashboard**: View task statistics and recent activities
- **Profile Management**: Update user information and settings
- **Theme Switching**: Toggle between light and dark themes

## Technologies Used

### Frontend
- Angular 19+
- Angular Material
- RxJS
- TypeScript

### Backend
- ASP.NET Core 9.0
- Entity Framework Core
- SQL Server
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js (latest LTS)
- .NET 9.0 SDK
- SQL Server

### Backend Setup
1. Navigate to the Backend directory
```
cd Backend
```

2. Restore packages
```
dotnet restore
```

3. Update the database
```
dotnet ef database update
```

4. Run the backend
```
dotnet run
```
The API will be available at: http://localhost:5041

### Frontend Setup
1. Navigate to the Frontend directory
```
cd Frontend
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
ng serve
```
The application will be available at: http://localhost:4200

## Project Structure

```
TaskManagementSystem/
├── Backend/
│   ├── controllers/     # API controllers 
│   ├── models/          # Data models
│   ├── data/            # Database context and migrations
│   └── services/        # Business logic and services
│
└── Frontend/
    └── src/
        └── app/
            ├── components/           # UI components organized by feature
            │   ├── auth/             # Authentication components
            │   ├── core/             # Core UI components
            │   ├── tasks/            # Task-related components
            │   └── boards/           # Board-related components (historical)
            │
            ├── services/             # Angular services
            ├── models/               # TypeScript interfaces
            └── dashboard/            # Dashboard component
```

## Future Improvements

### Code Organization
- Move all components into the components directory with proper categorization
- Implement a shared module for common components
- Create feature modules for better code organization

### Features
- Add drag-and-drop functionality for task management
- Implement task filtering and sorting
- Add user avatars and profile pictures
- Implement email notifications
- Add data visualization for task statistics
- Create mobile apps using Angular with Capacitor or Ionic

### Performance
- Implement lazy loading for feature modules
- Add caching for frequent API calls
- Optimize database queries with proper indexing

### Testing
- Add comprehensive unit tests for both frontend and backend
- Implement E2E testing with Cypress or Playwright
- Set up CI/CD pipeline for automated testing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

