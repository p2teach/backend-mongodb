import express from 'express'
import { createBookings, getUserBookings } from '../controllers/bookingController'

const router = express.Router()

router.post("/create", createBookings)
router.get("/user/:userId", getUserBookings)

export default router