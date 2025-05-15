import Session from "../models/Session";
import User, { IUser } from "../models/User";

// Create Session
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

		const user = await User.findById(user_id);
		if (!user) {
			return res
				.status(404)
				.json({ message: "User not found", success: false });
		}

		const session = await new Session({
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
	} catch (error) {
		console.error("Error creating session:", error);
		return res
			.status(500)
			.json({ message: "Internal server error", success: false });
	}
};

// Update Session
export const updateSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;
		const { coursetitle, subjectitle, price, duration } = req.body;

		const session = await Session.findById(id);
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
	} catch (error) {
		console.error("Error updating session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Delete Session
export const deleteSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;

		const session = await Session.findByIdAndDelete(id);
		if (!session) {
			return res.status(404).json({ error: "Session not found" });
		}

		return res.status(200).json({ message: "Session deleted successfully" });
	} catch (error) {
		console.error("Error deleting session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Get User's Sessions
export const getUserSessions = async (req: any, res: any) => {
	try {
		const { user_id } = req.params;

		const user = await User.findById(user_id).populate("sessions");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const sessions = await Session.find({ user: user._id }).populate({
			path: "user",
			select: "firstname lastname email program",
		});

		return res.status(200).json({ sessions });
	} catch (error) {
		console.error("Error fetching user sessions:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Get single Session
export const getSession = async (req: any, res: any) => {
	try {
		const { id } = req.params;

		const session = await Session.findById(id).populate({
			path: "user",
			select: "firstname lastname email program",
		});
		if (!session) {
			return res.status(404).json({ error: "Session not found" });
		}

		return res.status(200).json({ session });
	} catch (error) {
		console.error("Error fetching session:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Get All Sessions
export const getAllSessions = async (req: any, res: any) => {
	try {
		const sessions = await Session.find()
			.populate({
				path: "user",
				select: "firstname lastname email program",
			})
			.sort({ created_at: -1 });

		const formattedSessions = sessions.map((session) => {
			const user = session.user as IUser;
			return {
				id: session._id,
				coursetitle: session.coursetitle,
				subjectitle: session.subjectitle,
				price: session.price,
				duration: session.duration,
				createdAt: session.createdAt,
				walletaddress: session.walletaddress,
				tutor:
					session.user &&
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
	} catch (error: any) {
		console.error("Error fetching sessions:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve sessions",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};
