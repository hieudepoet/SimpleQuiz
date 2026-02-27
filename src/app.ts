import express, { Application } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import methodOverride from 'method-override'
import { engine } from 'express-handlebars'
import apiRoutes from './routes' // Existing API routes
import uiRoutes from './routes/ui' // New UI routes
import connectDB from './config/db'

dotenv.config();

const app: Application = express()

// Connect Database
connectDB()

// CORS - allow React dev server and production frontend
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000']
app.use(cors({ origin: allowedOrigins, credentials: true }))

// Body Parser
app.use(express.json()) // For API
app.use(express.urlencoded({ extended: true })) // For HTML Forms

// Method Override (for PUT/DELETE in forms)
app.use(methodOverride('_method'))

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// View Engine Setup
// 1. Handlebars (Main Engine)
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}))
// 2. EJS (For specific pages)
app.engine('ejs', require('ejs').__express)

// Set default view engine to hbs
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Routes
app.use('/api', apiRoutes) // API Routes
app.use('/', uiRoutes)     // UI Routes

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api`)
    console.log(`UI available at http://localhost:${PORT}`)
})

