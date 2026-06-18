import express from "express";
import { getAllUsers, getAllTasks, updateTask, deleteTask } from "../controllers/adminController.js";;
import { protect } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/roleMiddleware.js"

const router = express.Router();

router.get("/tasks", protect, isAdmin, getAllTasks);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/task/:id", protect, isAdmin, updateTask);
router.delete("/task/:id", protect, isAdmin, deleteTask);

export default router;