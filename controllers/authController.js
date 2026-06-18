import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createUserPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
})

export const signUp = async (req, res) => {
    try {
        const { name, phone, email, password,role } = req.body;
        const userData = {name,phone,email ,password};
        if (role !== undefined) userData.role = role;
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] }).select('email phone');
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'phone No';
            return res.status(409).json({
                success: false,
                message: `User with this ${field} already exists`
            })
        }

        const newUser = new User(userData);
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error("SignUp error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const userPayload = createUserPayload(user);
        const token = generateToken(userPayload)

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userPayload
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}