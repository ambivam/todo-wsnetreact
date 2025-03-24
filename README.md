# Todo Application

A full-stack todo application built with React and ASP.NET Core, featuring task categorization and modern UI.

## Features

- Create, read, update, and delete todos
- Categorize tasks (Work, Personal, Shopping, Health, Important, Study)
- Filter todos by category
- Modern Material-UI interface
- Mark todos as complete/incomplete
- Real-time error handling and feedback

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQLite Database
- CORS enabled for frontend communication

### Frontend
- React with TypeScript
- Material-UI components
- Axios for API calls
- Modern React Hooks

## Prerequisites

- .NET 8.0 SDK or later
- Node.js 16.x or later
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd WindNetDemo
```

2. Start the backend:
```bash
cd TodoApi
dotnet run
```
The API will be available at `http://localhost:5141`

3. Start the frontend:
```bash
cd todo-client
npm install
npm start
```
The application will open at `http://localhost:3000`

## Project Structure

```
WindNetDemo/
├── TodoApi/                # Backend
│   ├── Controllers/        # API endpoints
│   ├── Models/            # Data models
│   ├── Data/             # Database context
│   └── Program.cs        # Application entry point
│
└── todo-client/          # Frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── types/       # TypeScript types
    │   └── App.tsx      # Root component
    └── package.json     # Dependencies
```

## API Endpoints

- `GET /api/todo` - Get all todos
- `GET /api/todo/{id}` - Get a specific todo
- `POST /api/todo` - Create a new todo
- `PUT /api/todo/{id}` - Update a todo
- `DELETE /api/todo/{id}` - Delete a todo

## Development

- The backend uses Entity Framework Core with SQLite
- Database is automatically created on startup
- CORS is configured to allow requests from the frontend
- Frontend uses TypeScript for type safety
- Material-UI provides a consistent design system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
