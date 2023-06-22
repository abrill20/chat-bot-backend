// user router
import express from 'express';
import { UserController } from '../controllers/userController';
import passport from '../Auth/passport';

function checkAuthentication(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) {
    console.log("User is authenticated");
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export const userRouter = express.Router();

userRouter.get("/", UserController.getCurrentUser)

userRouter.post("/register", UserController.registerUser);

userRouter.post("/login", passport.authenticate("local"), UserController.loginUser);

userRouter.get("/logout", UserController.logoutUser);