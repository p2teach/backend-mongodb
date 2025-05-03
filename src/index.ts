import express from 'express';
import { getDatabase } from './config/database';
import userRoutes from "./routes/userRoutes"
import bodyParser from 'body-parser';
import morgan from 'morgan'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use("/api/user", userRoutes)

async function main() {
  try {
    // Initialize database
    const sequelize = await getDatabase();

    
    app.get('/', (req, res) => {
      res.send('Backend is running with PostgreSQL and TypeScript!');
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error);
    process.exit(1);
  }
}

main();