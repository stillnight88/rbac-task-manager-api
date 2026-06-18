import express from "express";
import { getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { validateTask } from "../utils/validateTask.js";
import { protect } from "../middleware/authMiddleware.js"
import { roleMiddleware } from "../middleware/roleMiddleware.js"

const router = express.Router();

router.get("/task/:id" , protect, roleMiddleware,getTaskById);
router.post("/task" , protect ,validateTask,createTask);
router.put("/task/:id" , protect,roleMiddleware,updateTask);
router.delete("/task/:id" , protect , roleMiddleware,deleteTask);

export default router;