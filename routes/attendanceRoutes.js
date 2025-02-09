import express from "express";
import { authenticateToken } from "../utils/middleware.js";
import {
  clockIn,
  clockOut,
  getAttendanceReport,
  notifAttendanceFromEmail,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/clock_in", authenticateToken, clockIn);
router.post("/clock_out", authenticateToken, clockOut);
router.get("/report", authenticateToken, getAttendanceReport);
router.post("/send_email", authenticateToken, notifAttendanceFromEmail);

export default router;
