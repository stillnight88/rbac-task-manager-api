import express from "express";
import {signUp , login} from "../controllers/authController.js";
import {validateSignUp , validateLogin}  from "../utils/validateUser.js";

const router = express.Router();

router.post("/signup",validateSignUp,signUp);
router.post("/login" ,validateLogin,login);

export default router;