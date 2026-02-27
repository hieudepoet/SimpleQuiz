# Question Bank Management Application

## Project Structure

```
assignment1-simplequiz/
├── .env
├── package.json
├── package-lock.json
├── tsconfig.json
├── src/
│   ├── app.ts                  # Application entry point
│   ├── config/
│   │   └── db.ts               # Database connection
│   ├── controllers/
│   │   ├── question.controller.ts    # API Controller for Questions
│   │   ├── quiz.controller.ts        # API Controller for Quizzes
│   │   └── ui/                       # UI Controllers
│   │       ├── question.ui.controller.ts
│   │       └── quiz.ui.controller.ts
│   ├── models/
│   │   ├── question.model.ts   # Mongoose model for Question
│   │   └── quiz.model.ts       # Mongoose model for Quiz
│   ├── public/
│   │   └── css/
│   │       └── style.css       # Custom styles
│   ├── routes/
│   │   ├── index.ts            # API Routes entry point
│   │   ├── question.routes.ts  # API Routes for Questions
│   │   ├── quiz.routes.ts      # API Routes for Quizzes
│   │   └── ui/                 # UI Routes
│   │       ├── index.ts        # UI Routes entry point
│   │       ├── question.ui.routes.ts
│   │       └── quiz.ui.routes.ts
│   └── views/
│       ├── index.hbs           # Home page
│       ├── layouts/
│       │   └── main.hbs        # Main Handlebars layout
│       ├── partials/
│       │   ├── footer.ejs
│       │   ├── footer.hbs
│       │   ├── head.ejs
│       │   ├── header.ejs
│       │   └── header.hbs
│       ├── questions/          # Question views (EJS)
│       │   ├── create.ejs
│       │   ├── details.ejs
│       │   ├── edit.ejs
│       │   └── list.ejs
│       └── quiz/               # Quiz views (EJS)
│           ├── create.ejs
│           ├── details.ejs
│           ├── edit.ejs
│           └── list.ejs
```

## Features

- **Quiz Management**: Create, Read, Update, Delete quizzes.
- **Question Management**: Create, Read, Update, Delete questions.
- **Dual View Engines**:
  - **Handlebars (.hbs)** for layouts and main pages.
  - **EJS (.ejs)** for dynamic content pages (quizzes/questions).
- **Backend API**: RESTful API for handling data operations.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file with your MongoDB connection string:
    ```
    MONGO_URI=mongodb://localhost:27017/simplequiz
    PORT=3000
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Access Application**:
    - UI: `http://localhost:3000`
    - API: `http://localhost:3000/api`
