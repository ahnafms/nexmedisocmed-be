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

      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body;

    try {
      const user = await this.userServices.loginUser({
        email,
        password,
      });

      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return next(error);
    }
  };
}
