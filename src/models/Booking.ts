import { DataTypes, Model, Optional } from "sequelize";
import { initializeSequelize } from "../config/database";
import { UserAttributes } from "./User";
import { isValidAddress } from "ethereumjs-util";
import User from "./User";

const sequelize = initializeSequelize();

export interface BookingAttributes {
    id: number; // Changed from string to number to match SERIAL in PostgreSQL
    location: string;
    date: Date;
    time: string;
    tutorid: number; // Changed from string to number
    studentid: number; // Changed from string to number
    tutorwalletaddress: string;
    studentwalletaddress: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface BookingCreationAttributes 
    extends Optional<BookingAttributes, "id" | "created_at" | "updated_at"> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> 
    implements BookingAttributes {
    
    public id!: number; // Changed from string to number
    public location!: string;
    public date!: Date;
    public time!: string;
    public tutorid!: number; // Changed from string to number
    public studentid!: number; // Changed from string to number
    public tutorwalletaddress!: string;
    public studentwalletaddress!: string;
    public created_at!: Date;
    public updated_at!: Date;

    public readonly tutor?: UserAttributes;
    public readonly student?: UserAttributes;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER, // Changed from UUID to INTEGER
            primaryKey: true,
            autoIncrement: true, // Added to match SERIAL
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        tutorid: {
            type: DataTypes.INTEGER, // Changed from UUID to INTEGER
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        studentid: {
            type: DataTypes.INTEGER, // Changed from UUID to INTEGER
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        tutorwalletaddress: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEthAddress(value: string) {
                    if (!isValidAddress(value)) {
                        throw new Error("Invalid Ethereum address");
                    }
                },
            },
        },
        studentwalletaddress: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEthAddress(value: string) {
                    if (!isValidAddress(value)) {
                        throw new Error("Invalid Ethereum address");
                    }
                },
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Booking",
        tableName: "bookings",
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

// Associations
Booking.belongsTo(User, { foreignKey: "tutorid", as: "tutor" });
Booking.belongsTo(User, { foreignKey: "studentid", as: "student" });

User.hasMany(Booking, { foreignKey: "tutorid", as: "tutorBookings" });
User.hasMany(Booking, { foreignKey: "studentid", as: "studentBookings" });

export default Booking;