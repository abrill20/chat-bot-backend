// user controller
import { Request, Response } from 'express';
// db client
import { db } from '../utils/db.server';
import { User } from '../lib/types';

export class UserController {

  static getAllUsers = async (req: Request, res: Response) => {
    // get users from database
    const users = await db.user.findMany();
    res.json(users);

  }

  static getUserById = async (req: Request, res: Response) => {
    // get user from database
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: {
        id: Number(id)
      }
    });
    res.json(user);

  }

  static createUser = async (req: Request<{},{}, User>, res: Response) => {
    // create user
    const { username, email, password } = req.body;
    const user = await db.user.create({
      data: {
        name: username,
        email,
        password
      }
    });
    res.json(user);
  }

  getChatsByUserId = async (req: Request, res: Response) => {
    // get chats from database
    const { id } = req.params;
    const chats = await db.chat.findMany({
      where: {
        userId: Number(id)
      }
    });
    res.json(chats);

  }


}
