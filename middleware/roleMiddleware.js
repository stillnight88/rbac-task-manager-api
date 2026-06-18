import Task from '../models/Task.js';
import { Types } from 'mongoose';


const sendErrorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({
        success: false,
        message
    });
};

const validateObjectId = (id) => {
    return Types.ObjectId.isValid(id);
};

export const roleMiddleware = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid task ID format');
        }

        const task = await Task.findById(id).select('assignedTo').lean();
        if (!task) {
            return sendErrorResponse(res, 404, 'Task not found')
        }
        if (!task.assignedTo) {
            return sendErrorResponse(res, 403, 'Access denied. Task has no owner')
        }

        const taskAssignedId = task.assignedTo.toString();
        const currentUserId = req.user.id.toString();

        if (taskAssignedId !== currentUserId) {
            return sendErrorResponse(res, 403, 'Access denied. You can only modify your own tasks')
        }

        req.task = task;
        next();


    } catch (error) {
        console.log("role error: ", error);
        return sendErrorResponse(res, 500, 'Server error')
    }
}

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, 401, 'Authentication required');
        }

        if (!req.user.role) {
            return sendErrorResponse(res, 403, 'User role not defined');
        }

        if (req.user.role.toLowerCase() !== 'admin') {
            return sendErrorResponse(res, 403, 'Access denied. Admin privileges required');
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error.message);
        return sendErrorResponse(res, 500, 'Authorization check failed');
    }
};
