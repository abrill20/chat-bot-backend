// user router
import express from 'express';
import { UserController } from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/', UserController.getAllUsers);

userRouter.get('/:id', UserController.getUserById);




