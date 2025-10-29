# Team Expense Management System

A full-stack application for managing team expenses, budgets, and spending insights with AI-powered category suggestions and automated email alerts.

## Features

- **Team Management**: Create and manage teams with individual budgets and members
- **Expense Tracking**: Add, edit, and delete expenses linked to teams
- **Budget Monitoring**: Real-time tracking of spending against team budgets
- **Email Alerts**: Automated notifications when teams exceed 80% or 100% of their budget
- **AI-Powered Categorization**: Intelligent expense category suggestions based on description
- **Filtering & Pagination**: Filter expenses by team, category, status, and date range

## Tech Stack

### Backend
- **Node.js** with **Express** (v5.1.0)
- **TypeScript**
- **MongoDB** with **Mongoose** (v8.19.2)
- **OpenAI API** (GPT-3.5-turbo) for AI categorization
- **Brevo** for email notifications

### Frontend
- **React** (v19.1.1) with **TypeScript**
- **Vite** for build tooling
- **TanStack Query** for data fetching
- **React Hook Form** with **Zod** for form validation
- **Tailwind CSS** with **shadcn/ui** components
- **Axios** for API calls

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (Atlas)
- OpenAI API key
- Brevo API key
- npm

## Installation & Setup

### 1. Clone the repository

```bash
git clone 
cd team-expense-manager
```

### 2. Install dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory based on `.env.example`:

```bash
# Database Configuration MongoDb Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-expense-manager

# Server Configuration
PORT=5000

# OpenAI API Configuration
# https://platform.openai.com/api-keys
OPENAI_API_KEY=openai_api_key

# Brevo Email Service Configuration
# https://app.brevo.com/settings/keys/api
BREVO_API_KEY=brevo_api_key
# Your verified sender email in Brevo
BREVO_SENDER_EMAIL=noreply@team_expense_manager.com
```

### 5. Seed the database (optional)

```bash
cd server
npm run seed
```

This will create sample teams and expenses for testing.

### 6. Run the application

**Terminal 1 - Start the backend server:**
```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

**Terminal 2 - Start the frontend client:**
```bash
cd client
npm start
```

The client will run on `http://localhost:5173` 

## API Documentation

All API endpoints return responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Teams API

Base URL: `http://localhost:5000/teams`

#### Get All Teams
```http
GET /teams
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Engineering Team",
      "budget": 50000,
      "members": ["john@example.com"],
      "totalSpent": 4150,
      "budgetStatus": {
        "budget": 50000,
        "totalSpent": 4150,
        "remaining": 45850,
        "percentageUsed": 8.3,
        "status": "safe"
      }
    }
  ]
}
```

#### Get Team by ID
```http
GET /teams/:id
```

#### Create Team
```http
POST /teams
Content-Type: application/json

{
  "name": "Marketing Team",
  "budget": 30000,
  "members": ["alice@example.com", "bob@example.com"]
}
```

#### Update Team
```http
PUT /teams/:id
Content-Type: application/json

{
  "name": "Updated Team Name",
  "budget": 35000,
  "members": ["new@example.com"]
}
```

#### Delete Team
```http
DELETE /teams/:id
```

**Note:** Teams with existing expenses cannot be deleted.

### Expenses API

Base URL: `http://localhost:5000/expenses`

#### Get All Expenses
```http
GET /expenses
```

#### Get Expense by ID
```http
GET /expenses/:id
```

#### Create Expense
```http
POST /expenses
Content-Type: application/json

{
  "teamId": "team_id_here",
  "amount": 2500,
  "description": "AWS Cloud Services",
  "category": "equipment",
  "date": "2025-10-01T00:00:00.000Z",
  "status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "teamId": { "_id": "...", "name": "...", "budget": 50000 },
    "amount": 2500,
    "description": "AWS Cloud Services",
    "category": "equipment",
    "status": "pending",
    "date": "2025-10-01T00:00:00.000Z"
  }
}
```

**Note:** Creates expense, recalculates team spending, and sends email alerts if thresholds are crossed.

#### Update Expense
```http
PUT /expenses/:id
Content-Type: application/json

{
  "amount": 3000,
  "status": "approved"
}
```

#### Delete Expense
```http
DELETE /expenses/:id
```

**Note:** Deletes expense and recalculates team spending.

### AI API

Base URL: `http://localhost:5000/ai`

#### Suggest Category
```http
POST /ai/suggest-category
Content-Type: application/json

{
  "description": "Flight tickets to Italy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "travel",
    "confidence": 95,
    "reasoning": "Mentions flight tickets."
  }
}
```

**Categories:** `travel`, `food`, `supplies`, `equipment`, `marketing`, `subscriptions`, `services`, `rentals`, `utilities`, `entertainment`, `other`

## AI Feature: Smart Category Suggestion

### Choice: Smart Categorization

I implemented **AI-powered expense category suggestion** using OpenAI's GPT-3.5-turbo model.

### How It Works

1. **Quick Keyword Match**: First checks for common keywords (e.g., "flight", "restaurant", "laptop")
2. **AI Analysis**: If no match, uses OpenAI to analyze the description context
3. **Confidence Score**: Returns category with confidence level (0-100)
4. **Auto-fill**: Frontend auto-fills category if confidence ≥ 85%

## Architecture Decisions

### 1. Service Layer Pattern

Separated business logic from routes into service layers:
- `teamService.ts`: Team CRUD and budget calculations
- `expenseService.ts`: Expense CRUD, budget alerts, and email triggers
- `aiService.ts`: AI categorization logic
- `emailService.ts`: Email sending abstraction

### 2. Normalized Data Model

- Teams and Expenses are separate collections with `ObjectId` references
- `totalSpent` is calculated and stored on Team (for performance)
- Indexes on `teamId` and `date` for efficient queries

### 3. Budget Alert System

- Tracks `alertSent80` and `alertSent100` flags to prevent duplicate emails
- Alerts trigger when expenses are created/updated
- Flags reset when spending drops

### 4. Validation Strategy

- **Frontend**: Zod schemas for immediate user feedback
- **Backend**: Mongoose schema validation for data integrity

### 5. Error Handling

- Consistent error response format: `{ success: boolean, error?: string, data?: any }`
- External service failures (email, AI) don't crash the app
