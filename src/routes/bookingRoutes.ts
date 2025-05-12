import express from 'express'
import {
	createBookings,
	deleteBooking,
	getUserBookings,
} from "../controllers/bookingController";

const router = express.Router();

router.post("/create", createBookings);
router.get("/user/:userId", getUserBookings);
router.delete("/user/:bookingId", deleteBooking);

export default router