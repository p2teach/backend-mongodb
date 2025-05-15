"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/user", userRoutes_1.default);
app.use("/api/sessions", sessionRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Backend is running");
});
async function startServer() {
    try {
        (0, database_1.default)();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}
startServer();
