import express from 'express';
import { createSession, deleteSession, getSession, getUserSessions, updateSession } from '../controllers/sessionController';

const router = express.Router();

router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.get('/user/:user_id', getUserSessions);
router.get('/:id', getSession);

export default router;