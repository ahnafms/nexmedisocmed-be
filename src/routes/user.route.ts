import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { createUserDto, loginUserDto } from "@/dto/user";
import { UserController } from "@/controllers/user.controllers";
import { authMiddleware } from "@/middleware/auth.middleware";

export const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", validate(createUserDto), userController.register);
userRouter.post("/login", validate(loginUserDto), userController.login);
userRouter.get("/logout", userController.logout);

userRouter.get("/check-auth", authMiddleware, userController.checkAuth);
