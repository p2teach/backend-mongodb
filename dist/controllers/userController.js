"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const SALT_ROUNDS = 10;
const register = async (req, res) => {
    try {
        const { program, firstname, lastname, email, password } = req.body;
        if (!program || !firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Create new user
        const newUser = await User_1.default.create({
            program,
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id?.toString(), email: newUser.email }, JWT_SECRET, { expiresIn: "24h" });
        // Return success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id?.toString(),
                program: newUser.program,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await User_1.default.findOne({ email });
        console.log("user data ---- user", user);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Compare passwords
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id?.toString(), email: user.email }, JWT_SECRET, { expiresIn: "24h" });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id?.toString(),
                program: user.program,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
