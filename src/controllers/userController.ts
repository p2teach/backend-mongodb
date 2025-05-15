import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const SALT_ROUNDS = 10;

interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	user?: {
		id: string; // MongoDB _id will be returned as string
		email: string;
		firstname: string;
		lastname: string;
		program: string;
	};
}

export const register = async (req: Request, res: Response<AuthResponse>) => {
	try {
		const { program, firstname, lastname, email, password } = req.body;

		if (!program || !firstname || !lastname || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Email already exists",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		// Create new user
		const newUser = await User.create({
			program,
			firstname,
			lastname,
			email,
			password: hashedPassword,
		});

		// Generate JWT token
		const token = jwt.sign(
			{ id: newUser._id?.toString(), email: newUser.email },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);

		// Return success response
		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user: {
				id: newUser._id?.toString()!,
				program: newUser.program,
				email: newUser.email,
				firstname: newUser.firstname,
				lastname: newUser.lastname,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const login = async (req: Request, res: Response<AuthResponse>) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const user = await User.findOne({ email });

		console.log("user data ---- user", user);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id?.toString(), email: user.email },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);

		return res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id?.toString()!,
				program: user.program,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
