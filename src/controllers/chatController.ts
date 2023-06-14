// chat controller
import { Request, Response } from 'express';
// db client
import { db } from '../utils/db.server';
import { Chat } from '../lib/types';

export class ChatController {

  static getAllChats = async (req: Request, res: Response) => {
    // get chats from database
    const chats = await db.chat.findMany();
    res.json(chats);

  }

  static getChatById = async (req: Request, res: Response) => {
    // get chat from database
    const { id } = req.params;
    const chat = await db.chat.findUnique({
      where: {
        id: Number(id)
      }
    });
    res.json(chat);

  }

  static createChat = async (req: Request<{},{}, Chat>, res: Response) => {
    // create chat
    const { title, userId } = req.body;
    const chat = await db.chat.create({
      data: {
        title,
        userId
      }
    });
    res.json(chat);
  }

  static getChatMessagesById = async (req: Request, res: Response) => {
    // get chat messages from database
    const { id } = req.params;
    const messages = await db.message.findMany({
      where: {
        chatId: Number(id)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(messages);

  }


}