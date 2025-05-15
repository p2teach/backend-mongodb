import mongoose, { Schema, Document, Types } from "mongoose";
import { isValidAddress } from "ethereumjs-util";
import { IUser } from "./User";

export interface IBooking extends Document {
	location: string;
	date: Date;
	time: string;
	tutor: Types.ObjectId | IUser;
	student: Types.ObjectId | IUser;
	tutorwalletaddress: string;
	studentwalletaddress: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
	{
		location: { type: String, required: true },
		date: { type: Date, required: true },
		time: { type: String, required: true },
		tutor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		student: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tutorwalletaddress: {
			type: String,
			required: true,
			validate: {
				validator: function (value: string) {
					return isValidAddress(value);
				},
				message: "Invalid Ethereum address",
			},
		},
		studentwalletaddress: {
			type: String,
			required: true,
			validate: {
				validator: function (value: string) {
					return isValidAddress(value);
				},
				message: "Invalid Ethereum address",
			},
		},
	},
	{
		timestamps: true,
	}
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
