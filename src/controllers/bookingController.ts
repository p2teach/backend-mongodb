import Booking from "../models/Booking";
import User from "../models/User";
import mongoose from "mongoose";

// Create Booking
export const createBookings = async (req: any, res: any) => {
	try {
		const {
			location,
			time,
			date,
			tutorid,
			studentid,
			tutorwalletaddress,
			studentwalletaddress,
		} = req.body;

		if (
			!location ||
			!time ||
			!date ||
			!tutorid ||
			!studentid ||
			!tutorwalletaddress ||
			!studentwalletaddress
		) {
			return res.status(400).json({
				success: false,
				message:
					"All fields (location, time, date, tutorid, studentid, wallet addresses) are required",
			});
		}

		const existingBooking = await Booking.findOne({
			tutor: tutorid,
			date,
			time,
		});

		if (existingBooking) {
			return res.status(409).json({
				success: false,
				message:
					"A booking already exists for this tutor at the specified date and time",
			});
		}

		const tutor = await User.findById(tutorid);
		const student = await User.findById(studentid);

		if (!tutor || !student) {
			return res.status(404).json({
				success: false,
				message: "Tutor or student not found",
			});
		}

		const newBooking = await Booking.create({
			location,
			time,
			date,
			tutor: tutorid,
			student: studentid,
			tutorwalletaddress,
			studentwalletaddress,
		});

		return res.status(201).json({
			success: true,
			data: newBooking,
			message: "Booking created successfully",
		});
	} catch (error: any) {
		console.error("Booking creation error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};

// Get User Bookings (both as tutor & student)
export const getUserBookings = async (req: any, res: any) => {
	try {
		const userId = req.params.userId;

		if (!mongoose.isValidObjectId(userId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID format",
			});
		}

		const tutorBookings = await Booking.find({ tutor: userId }).populate(
			"student"
		);
		const studentBookings = await Booking.find({ student: userId }).populate(
			"tutor"
		);

		return res.status(200).json({
			success: true,
			data: {
				tutorBookings,
				studentBookings,
			},
		});
	} catch (error: any) {
		console.error("Error fetching bookings:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};

// Delete Booking
export const deleteBooking = async (req: any, res: any) => {
	try {
		const bookingId = req.params.bookingId;

		if (!mongoose.isValidObjectId(bookingId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid booking ID format",
			});
		}

		const booking = await Booking.findById(bookingId);

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		await Booking.deleteOne({ _id: bookingId });

		return res.status(200).json({
			success: true,
			message: "Booking deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting booking:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete booking",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};
