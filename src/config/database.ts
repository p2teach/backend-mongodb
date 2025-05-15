import mongoose from "mongoose";
import dotConfig from "dotenv";
dotConfig.config();

const connectDB = async () => {
	console.log(
		"mongo uri ---- ",
		process.env?.MONGO_URI ??
			"mongodb+srv://benbaah104:zrQUDM2vEULgdwoc@cluster0.oxe7jyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	);
	try {
		const conn = await mongoose.connect(
			process.env?.MONGO_URI! ??
				"mongodb+srv://benbaah104:zrQUDM2vEULgdwoc@cluster0.oxe7jyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
		);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`MongoDB connection error:`, error);
		process.exit(1); // Stop the server if DB connection fails
	}
};

export default connectDB;
