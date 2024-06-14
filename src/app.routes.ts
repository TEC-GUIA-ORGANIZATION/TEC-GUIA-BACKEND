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

// Create a new router
const router = Router();
const root = "/api/";

// Test route
router.get(root, (req, res) => {
    res.send("API is running...");
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

export default router;
