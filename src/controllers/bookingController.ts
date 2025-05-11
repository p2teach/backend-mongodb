import { Request, Response } from 'express';
import Booking from "../models/Booking";
import User from "../models/User";

export const createBookings = async (req: any, res: any) => {
    console.log("payload", req.body)
    const { location, time, date, tutorid, studentid, tutorwalletaddress, studentwalletaddress } = req.body;

    if (!location || !time || !date || !tutorid || !studentid || !tutorwalletaddress || !studentwalletaddress) {
        return res.status(400).json({
            success: false,
            message: "All fields (location, time, date, tutorid, studentid) are required"
        });
    }

    try {
        const existingBooking = await Booking.findOne({
            where: {
                tutorid,
                date,
                time
            }
        });

        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "A session already exists for this tutor at the specified date and time"
            });
        }

        const tutor = await User.findByPk(tutorid);
        const student = await User.findByPk(studentid);

        if (!tutor || !student) {
            return res.status(404).json({
                success: false,
                message: "Tutor or student not found"
            });
        }

        const newBooking = await Booking.create({
            location,
            time,
            date,
            tutorid,
            studentid,
            tutorwalletaddress,
            studentwalletaddress
        });

        return res.status(201).json({
            success: true,
            data: newBooking,
            message: "Booking created successfully"
        });

    } catch (error: any) {
        console.error("Booking creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getUserBookings = async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await User.findByPk(userId, {
            include: [
                { 
                    model: Booking, 
                    as: 'tutorBookings',
                    include: [{ model: User, as: 'student' }]
                },
                { 
                    model: Booking, 
                    as: 'studentBookings',
                    include: [{ model: User, as: 'tutor' }]
                }
            ]
        });

        if (!user) {
            console.log("user not found")
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                tutorBookings: user.tutorBookings,
                studentBookings: user.studentBookings
            }
        });

    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};