import { UserServices } from "@/services/user.services";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

export class UserController {
  private userServices: UserServices;

  constructor(userServices = new UserServices()) {
    this.userServices = userServices;
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, password, email } = req.body;

    try {
      const user = await this.userServices.createUser({
        name,
        password,
        email,
      });

      res.status(HttpStatus.CREATED).json({
        message: "Success create user",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body;

    try {
      const token = await this.userServices.loginUser({
        email,
        password,
      });

      res.cookie("token", token.access_token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: "lax",
      });

      res.status(HttpStatus.OK).json({ message: "Success login" });
    } catch (error) {
      next(error);
    }
  };
}
