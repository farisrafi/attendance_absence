import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const options = {
  freezeTableName: true,
  timestamps: false,
  tableName: "attendance",
  comment: "",
  indexes: [],
};

const Attendance = sequelize.define(
  "attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clock_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clock_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  options
);

export default Attendance;
