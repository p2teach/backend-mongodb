import Session from "../models/Session"
import User from "../models/User";

export const createSession = async (req: any, res: any) => {
	try {
		const {
			user_id,
			coursetitle,
			subjectitle,
			price,
			duration,
			walletaddress,
		} = req.body;

		if (
			!user_id ||
			!coursetitle ||
			!subjectitle ||
			!price ||
			!duration ||
			!walletaddress
		) {
			return res
				.status(400)
				.json({ message: "All fields are required", success: false });
		}

		const user = await User.findByPk(user_id);
		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found", success: false });
		}

		const session = await Session.create({
			user_id,
			coursetitle,
			subjectitle,
			price,
			walletaddress,
			duration,
		});

		return res.status(201).json({
			message: "Session created successfully",
			success: true,
			session,
		});
	} catch (error) {
		console.error("Error creating session:", error);
		return res
			.status(500)
			.json({ message: "Internal server error", success: false });
	}
};

export const updateSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const { coursetitle, subjectitle, price, duration } = req.body;

		const session = await Session.findByPk(id);
		if (!session) {
			return res.status(404).json({ error: "Session not found" });
		}

		await session.update({
			coursetitle: coursetitle || session.coursetitle,
			subjectitle: subjectitle || session.subjectitle,
			price: price || session.price,
			duration: duration || session.duration,
		});

		return res.status(200).json({
			message: "Session updated successfully",
			session,
		});
	} catch (error) {
		console.error("Error updating session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;

		const session = await Session.findByPk(id);
		if (!session) {
			return res.status(404).json({ error: "Session not found" });
		}

		await session.destroy();

		return res.status(200).json({
			message: "Session deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserSessions = async (req: any, res: any) => {
	try {
		const { user_id } = req.params;

		const user = await User.findByPk(user_id, {
			include: [{ model: Session, as: "sessions" }],
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({
			sessions: user,
		});
	} catch (error) {
		console.error("Error fetching user sessions:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;

		const session = await Session.findByPk(id, {
			include: [{ model: User, as: "user" }],
		});

		if (!session) {
			return res.status(404).json({ error: "Session not found" });
		}

		return res.status(200).json({
			session,
		});
	} catch (error) {
		console.error("Error fetching session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllSessions = async (req: any, res: any) => {
	try {
		const sessions = await Session.findAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "firstname", "lastname", "email", "program"],
				},
			],
			order: [["created_at", "DESC"]],
		});

		// Format the response to avoid sending sensitive data
		const formattedSessions = sessions.map((session) => ({
			id: session.id,
			coursetitle: session.coursetitle,
			subjectitle: session.subjectitle,
			price: session.price,
			duration: session.duration,
			createdAt: session.created_at,
			walletaddress: session.walletaddress,
			tutor: {
				id: session.user?.id,
				name: session.user
					? `${session.user.firstname} ${session.user.lastname}`
					: "Unknown",
				email: session.user?.email,
				program: session.user?.program,
			},
		}));

		return res.status(200).json({
			success: true,
			data: formattedSessions,
			message: "Sessions retrieved successfully",
		});
	} catch (error: any) {
		console.error("Error fetching sessions:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve sessions",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};