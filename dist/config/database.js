"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    console.log("mongo uri ---- ", process.env?.MONGO_URI ??
        "mongodb+srv://benbaah104:zrQUDM2vEULgdwoc@cluster0.oxe7jyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    try {
        const conn = await mongoose_1.default.connect(process.env?.MONGO_URI ??
            "mongodb+srv://benbaah104:zrQUDM2vEULgdwoc@cluster0.oxe7jyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB connection error:`, error);
        process.exit(1); // Stop the server if DB connection fails
    }
};
exports.default = connectDB;
