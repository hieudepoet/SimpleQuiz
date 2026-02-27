"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const express_handlebars_1 = require("express-handlebars");
const passport_1 = __importDefault(require("passport"));
require("./config/passport-config"); // Passport JWT strategy configuration
const routes_1 = __importDefault(require("./routes")); // Existing API routes
const ui_1 = __importDefault(require("./routes/ui")); // New UI routes
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect Database
(0, db_1.default)();
// Body Parser
app.use(express_1.default.json()); // For API
app.use(express_1.default.urlencoded({ extended: true })); // For HTML Forms
// Method Override (for PUT/DELETE in forms)
app.use((0, method_override_1.default)('_method'));
// Passport middleware
app.use(passport_1.default.initialize());
// Static Folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// View Engine Setup
// 1. Handlebars (Main Engine)
app.engine('hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path_1.default.join(__dirname, 'views/layouts'),
    partialsDir: path_1.default.join(__dirname, 'views/partials')
}));
// 2. EJS (For specific pages)
app.engine('ejs', require('ejs').__express);
// Set default view engine to hbs
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Routes
app.use('/api', routes_1.default); // API Routes
app.use('/', ui_1.default); // UI Routes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`UI available at http://localhost:${PORT}`);
});
