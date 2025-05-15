"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.getUserBookings = exports.createBookings = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create Booking
const createBookings = async (req, res) => {
    try {
        const { location, time, date, tutorid, studentid, tutorwalletaddress, studentwalletaddress, } = req.body;
        if (!location ||
            !time ||
            !date ||
            !tutorid ||
            !studentid ||
            !tutorwalletaddress ||
            !studentwalletaddress) {
            return res.status(400).json({
                success: false,
                message: "All fields (location, time, date, tutorid, studentid, wallet addresses) are required",
            });
        }
        const existingBooking = await Booking_1.default.findOne({
            tutor: tutorid,
            date,
            time,
        });
        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "A booking already exists for this tutor at the specified date and time",
            });
        }
        const tutor = await User_1.default.findById(tutorid);
        const student = await User_1.default.findById(studentid);
        if (!tutor || !student) {
            return res.status(404).json({
                success: false,
                message: "Tutor or student not found",
            });
        }
        const newBooking = await Booking_1.default.create({
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
    }
    catch (error) {
        console.error("Booking creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.createBookings = createBookings;
// Get User Bookings (both as tutor & student)
const getUserBookings = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose_1.default.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }
        const tutorBookings = await Booking_1.default.find({ tutor: userId }).populate("student");
        const studentBookings = await Booking_1.default.find({ student: userId }).populate("tutor");
        return res.status(200).json({
            success: true,
            data: {
                tutorBookings,
                studentBookings,
            },
        });
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getUserBookings = getUserBookings;
// Delete Booking
const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        if (!mongoose_1.default.isValidObjectId(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID format",
            });
        }
        const booking = await Booking_1.default.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        await Booking_1.default.deleteOne({ _id: bookingId });
        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete booking",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.deleteBooking = deleteBooking;
