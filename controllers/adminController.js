import User from "../models/User.js";
import Task from "../models/Task.js";

const sendErrorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({
        success: false,
        message
    })
}

const sendSuccessResponse = (response, statusCode, message, data = null) => {
    const jsonRes = {
        success: true,
        message,
    }
    if (data) jsonRes.data = data;
    return response.status(statusCode).json(jsonRes)
}

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const users = await User.find()
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await User.countDocuments();

        return sendSuccessResponse(res, 200, 'Users retrieved successfully', {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get all users error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    };
};

export const getAllTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const tasks = await Task.find()
            .populate('assignedTo', 'name email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Task.countDocuments();

        return sendSuccessResponse(res, 200, 'Tasks retrieved successfully', {
            tasks,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalTasks: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get all tasks error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    };
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('assignedTo', 'name email');


        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        };

        return sendSuccessResponse(res, 200, 'Task updated successfully', { task: updatedTask });

    } catch (error) {
        console.error("Update task error:", error);

        if (error.name === 'CastError') {
            return sendErrorResponse(res, 400, 'Invalid post ID format');
        };

        return sendErrorResponse(res, 500, 'Internal server error');
    };
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id).populate('assignedTo', 'name email');
        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
                data: { task: deleteTask }
            });
        };

        return sendSuccessResponse(res, 200, 'Task deleted successfully');


    } catch (error) {
        console.error("Delete task error:", error);

        if (error.name === 'CastError') {
            return sendErrorResponse(res, 400, 'Invalid post ID format');
        };

        return sendErrorResponse(res, 500, 'Internal server error');
    }
};