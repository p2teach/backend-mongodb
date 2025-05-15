import express from 'express';
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import connectDb from "./config/database";
import dotConfig from "dotenv";

const app = express();
const PORT = process.env.PORT || 3001;

dotConfig.config();

app.use(
	cors({
		origin: ["https://radiant-otter-f3ecff.netlify.app/", "*"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
	res.send("Backend is running");
});

async function startServer() {
	try {
		connectDb();
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Server startup failed:", error);
		process.exit(1);
	}
}

startServer();