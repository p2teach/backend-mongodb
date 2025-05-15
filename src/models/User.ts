import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define TypeScript interface for your document
export interface IUser extends Document {
	firstname: string;
	lastname: string;
	email: string;
	program: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// 2. Create schema
const UserSchema: Schema<IUser> = new Schema<IUser>(
	{
		firstname: { type: String, required: true, trim: true, maxlength: 100 },
		lastname: { type: String, required: true, trim: true, maxlength: 100 },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			maxlength: 100,
		},
		program: { type: String, required: true, maxlength: 50 },
		password: { type: String, required: true, minlength: 6 },
	},
	{
		timestamps: true, // Automatically creates createdAt and updatedAt
	}
);

// 3. Create model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
