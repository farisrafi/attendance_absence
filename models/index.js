import User from "./User.js";
import Attendance from "./Attedance.js";

User.hasMany(Attendance, { foreignKey: "user_id" });
Attendance.belongsTo(User, { foreignKey: "user_id" });

export { User, Attendance };
