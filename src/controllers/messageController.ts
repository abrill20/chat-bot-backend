// message controller
import { Request, Response } from 'express';
// prisma client
import { db } from '../utils/db.server';
import { Message } from '../lib/types';
import { User } from '@prisma/client';
import { get } from 'http';
import createChatBotMessage from '../ChatBot/ChatBot';

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
    if(!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { content, chatId } = req.body;
    const { id } = req.user as User;

    const gptResponseJSON = await createChatBotMessage(content, chatId);

    const chatBotMessage = await db.message.create({
      data: {
        content: gptResponseJSON.response,
        chatId,
        authorId: 1,
        type: "RECEIVED"
      }
    });
    
    const message = await db.message.create({
      data: {
        content,
        correction: gptResponseJSON.corrected_message,
        chatId,
        authorId: id,
      }
    });
    res.json({message, chatBotMessage});

  };

}
  