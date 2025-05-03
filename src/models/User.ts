import { DataTypes, Model, Optional } from 'sequelize';
import { initializeSequelize } from "../config/database";
const sequelize = initializeSequelize();

export interface UserCreationAttributes
	extends Optional<UserAttributes, "id" | "created_at" | "updated_at"> {}

interface UserAttributes {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	created_at?: Date;
	updated_at?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public username!: string;
	public firstname!: string;
	public lastname!: string;
	public email!: string;
	public password!: string;
	public created_at!: Date;
	public updated_at!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		firstname: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: "firstname", // Explicit mapping
		},
		lastname: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: "lastname", // Explicit mapping
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			field: "created_at",
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			field: "updated_at",
		},
	},
	{
		sequelize,
		modelName: "User",
		tableName: "users",
		timestamps: true,
		underscored: true, // Handles timestamp fields
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default User;