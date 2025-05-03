import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserCreationAttributes } from "../models/User";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const SALT_ROUNDS = 10;

interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	user?: {
		id: number;
		username: string;
		email: string;
		firstname: string;
		lastname: string;
	};
}

export const register = async (req: Request, res: Response<AuthResponse>) => {
	try {
		const { username, firstname, lastname, email, password } = req.body;

		if (!username || !firstname || !lastname || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ username }, { email }],
			},
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Username or email already exists",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		// Create new user with proper typing
		const newUser = await User.create({
			username,
			firstname,
			lastname,
			email,
			password: hashedPassword,
		} as any); // Type assertion here

		// Generate JWT token
		const token = jwt.sign(
			{ id: newUser.id, email: newUser.email },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);

		// Return success response
		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user: {
				id: newUser.id,
				username: newUser.username,
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

		const user = await User.findOne({ where: { email } });

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
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "24h",
		});

		return res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user.id,
				username: user.username,
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