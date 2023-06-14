// message controller
import { Request, Response } from 'express';
// prisma client
import { db } from '../utils/db.server';
import { Message } from '../lib/types';

export class MessageController {

  static getAllMessages = async (req: Request, res: Response) => {
    // get messages from database
    const messages = await db.message.findMany();
    res.json(messages);

  };

  static getMessageById = async (req: Request, res: Response) => {
    // get message from database
    const { id } = req.params;
    const message = await db.message.findUnique({
      where: {
        id: Number(id)
      }
    });
    res.json(message);

  };

  static createMessage = async (req: Request<{},{}, Message>, res: Response) => {
    // create message
    const { content, userId, chatId } = req.body;
    const message = await db.message.create({
      data: {
        content,
        chatId,
        authorId: userId
      }
    });
    res.json(message);
  };


}
  