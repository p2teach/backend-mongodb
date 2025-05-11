import { DataTypes, Model, Optional } from 'sequelize';
import { initializeSequelize } from "../config/database";
import { UserAttributes } from './User';
import User from './User'
const sequelize = initializeSequelize();

export interface SessionCreationAttributes
    extends Optional<SessionAttributes, "id" | "created_at" | "updated_at"> {}

interface SessionAttributes {
	id?: number;
	user_id: number;
	coursetitle: string;
	subjectitle: string;
	price: number;
	walletaddress: string;
	duration: number;
	created_at?: Date;
	updated_at?: Date;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
	public id!: number;
	public user_id!: number;
	public coursetitle!: string;
	public subjectitle!: string;
	public price!: number;
	public walletaddress!: string;
	public duration!: number;
	public created_at!: Date;
	public updated_at!: Date;

	// This will be populated by Sequelize
	public readonly user?: UserAttributes;
}

Session.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		coursetitle: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		subjectitle: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		walletaddress: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				max: 59,
			},
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
		modelName: "Session",
		tableName: "sessions",
		timestamps: true,
		underscored: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

Session.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

User.hasMany(Session, {
    foreignKey: 'user_id',
    as: 'sessions',
});

export default Session;