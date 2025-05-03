import express, { Express } from "express";
import { login, register } from "../controllers/userController";

const router = express.Router();

router.post("/auth/register", register as any).post("/auth/login", login as any)

export default router;