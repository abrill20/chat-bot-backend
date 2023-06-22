// user controller
import { Request, Response } from "express";
// db client
import { db } from "../utils/db.server";
import { User } from "../lib/types";
import bcrypt from "bcrypt";
import passport from "../Auth/passport";

export class UserController {
  static loginUser = async (req: Request, res: Response) => {
    res.send(req.user)
  };

  static registerUser = async (req: Request<{}, {}, User>, res: Response) => {
    // create user
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    // login user
    req.login(newUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Error logging in" });
        return;
      }
      res.status(200).send(newUser);
    });

  };

  static getCurrentUser = async (req: Request, res: Response) => {
    res.send(req.user);
  };

  static logoutUser = async (req: Request, res: Response) => {
    console.log("Logging out user");
    req.logout(function (err) {
      if (err) {
        res.status(500).json({ message: "Error logging out" });
        return;
      }
      console.log("User logged out");
      res.status(200).json({ message: "Logged out" });
    }
    );
  };
}
