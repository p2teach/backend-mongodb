"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: (v) => v <= 59,
            message: "Duration must be 59 or less",
        },
    },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "sessions",
});
exports.default = (0, mongoose_1.model)("Session", sessionSchema);
