import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface ISession extends Document {
	user: Types.ObjectId | IUser;
	coursetitle: string;
	subjectitle: string;
	price: number;
	walletaddress: string;
	duration: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const sessionSchema = new Schema<ISession>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		coursetitle: {
			type: String,
			required: true,
			maxlength: 150,
		},
		subjectitle: {
			type: String,
			required: true,
			maxlength: 150,
		},
		price: {
			type: Number,
			required: true,
		},
		walletaddress: {
			type: String,
			required: true,
			maxlength: 150,
		},
		duration: {
			type: Number,
			required: true,
			validate: {
				validator: (v: number) => v <= 59,
				message: "Duration must be 59 or less",
			},
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		collection: "sessions",
	}
);

export default model<ISession>("Session", sessionSchema);
