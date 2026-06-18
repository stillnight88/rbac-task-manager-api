import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [25, "Title cannot exceed 25 characters"],
        minlength: [1, "Title must be at least 1 characters"]
    },
    description: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "in-progress", "completed", "cancelled"],
            message: "Status must be one of: pending, in-progress, completed, cancelled"
        },
        default: "pending"
    },
     assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Task must be assigned to a user"],
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid user ID"
        }
    }

}, { timestamps: true })

TaskSchema.index({ assignedTo: 1, createdAt: -1 });
TaskSchema.index({ createdAt: -1 });

const Task = mongoose.model("Task", TaskSchema);
export default Task;