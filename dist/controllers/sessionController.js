"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSessions = exports.getSession = exports.getUserSessions = exports.deleteSession = exports.updateSession = exports.createSession = void 0;
const Session_1 = __importDefault(require("../models/Session"));
const User_1 = __importDefault(require("../models/User"));
// Create Session
const createSession = async (req, res) => {
    try {
        const { user_id, coursetitle, subjectitle, price, duration, walletaddress, } = req.body;
        if (!user_id ||
            !coursetitle ||
            !subjectitle ||
            !price ||
            !duration ||
            !walletaddress) {
            return res
                .status(400)
                .json({ message: "All fields are required", success: false });
        }
        const user = await User_1.default.findById(user_id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", success: false });
        }
        const session = await new Session_1.default({
            user: user._id,
            coursetitle,
            subjectitle,
            price,
            duration,
            walletaddress,
        }).save();
        return res.status(201).json({
            message: "Session created successfully",
            success: true,
            session,
        });
    }
    catch (error) {
        console.error("Error creating session:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
exports.createSession = createSession;
// Update Session
const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { coursetitle, subjectitle, price, duration } = req.body;
        const session = await Session_1.default.findById(id);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        session.coursetitle = coursetitle || session.coursetitle;
        session.subjectitle = subjectitle || session.subjectitle;
        session.price = price || session.price;
        session.duration = duration || session.duration;
        await session.save();
        return res.status(200).json({
            message: "Session updated successfully",
            session,
        });
    }
    catch (error) {
        console.error("Error updating session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateSession = updateSession;
// Delete Session
const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session_1.default.findByIdAndDelete(id);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        return res.status(200).json({ message: "Session deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteSession = deleteSession;
// Get User's Sessions
const getUserSessions = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User_1.default.findById(user_id).populate("sessions");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const sessions = await Session_1.default.find({ user: user._id }).populate({
            path: "user",
            select: "firstname lastname email program",
        });
        return res.status(200).json({ sessions });
    }
    catch (error) {
        console.error("Error fetching user sessions:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserSessions = getUserSessions;
// Get single Session
const getSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session_1.default.findById(id).populate({
            path: "user",
            select: "firstname lastname email program",
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        return res.status(200).json({ session });
    }
    catch (error) {
        console.error("Error fetching session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getSession = getSession;
// Get All Sessions
const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session_1.default.find()
            .populate({
            path: "user",
            select: "firstname lastname email program",
        })
            .sort({ created_at: -1 });
        const formattedSessions = sessions.map((session) => {
            const user = session.user;
            return {
                id: session._id,
                coursetitle: session.coursetitle,
                subjectitle: session.subjectitle,
                price: session.price,
                duration: session.duration,
                createdAt: session.createdAt,
                walletaddress: session.walletaddress,
                tutor: session.user &&
                    typeof session.user === "object" &&
                    "firstname" in session.user
                    ? {
                        id: user._id,
                        name: `${user.firstname} ${user.lastname}`,
                        email: user.email,
                        program: user.program,
                    }
                    : null,
            };
        });
        return res.status(200).json({
            success: true,
            data: formattedSessions,
            message: "Sessions retrieved successfully",
        });
    }
    catch (error) {
        console.error("Error fetching sessions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sessions",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getAllSessions = getAllSessions;
