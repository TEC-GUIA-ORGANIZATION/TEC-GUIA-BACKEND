// app.routes.ts

import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import professorRoutes from "./routes/professor.routes";
import studentRoutes from "./routes/student.routes";
import planningRoutes from "./routes/planning.routes";
import activityRoutes from "./routes/activity.routes";
import commentRoutes from "./routes/comment.routes";
import evidenceRoutes from "./routes/evidence.routes";
import notificationRoutes from "./routes/notification.routes";
import { Program } from "./services/program.service";

// Create a new router
const router = Router();
const root = "/api/";

// Test route
router.get(root, (req, res) => {
    res.send("API is running...");
});

router.post(root + "time", (req, res) => {
    const date = new Date(req.body.date);
    Program.getInstance().updateDate(date);
    res.status(200).json({
        date: date
    });
});

// Auth routes
router.use(root + "auth", authRoutes);

// Users routes 
router.use(root + "users", userRoutes);

// Professors routes
router.use(root + "professors", professorRoutes);

// Students routes
router.use(root + "students", studentRoutes);

// Planning routes 
router.use(root + "planning", planningRoutes);

// Activities routes
router.use(root + "activities", activityRoutes);

// Comments routes 
router.use(root + "comments", commentRoutes);

// Evidence routes 
router.use(root + "evidence", evidenceRoutes);

// Notifications routes
router.use(root + "notifications", notificationRoutes);

export default router;
