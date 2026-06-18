import Task from "../models/Task.js";
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

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid task ID format');
        }

        const task = await Task.findById(id)
            .populate('assignedTo', 'name email')
            .lean();
        if (!task) {
            return sendErrorResponse(res, 404, 'Task not found');
        }

        return res.status(200).json({
            success: true,
            message: 'Task retrieved successfully',
            data: { task }
        });

    } catch (error) {
        console.log("Get Task by Id error", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    }
}

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const taskData = { title, description, assignedTo: req.user?.id };

        const newTask = new Task(taskData);
        await newTask.save();

        await newTask.populate('assignedTo', 'name email');

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task: newTask }
        });
    } catch (error) {
        console.error("Create task error:", error);
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

        return res.status(201).json({
            success: true,
            message: 'Task updated successfully',
            data: { task: updatedTask }
        });

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

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error("Delete task error:", error);

        if (error.name === 'CastError') {
            return sendErrorResponse(res, 400, 'Invalid post ID format');
        };

        return sendErrorResponse(res, 500, 'Internal server error');
    }
};