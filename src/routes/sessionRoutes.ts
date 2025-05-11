import express from 'express';
import {
	createSession,
	deleteSession,
	getAllSessions,
	getSession,
	getUserSessions,
	updateSession,
} from "../controllers/sessionController";

const router = express.Router();
router.get("/all", getAllSessions);
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);
router.get("/user/:user_id", getUserSessions);
router.get("/:id", getSession);

export default router;