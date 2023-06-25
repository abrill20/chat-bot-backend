// message controller
import { Request, Response } from 'express';
// prisma client
import { db } from '../utils/db.server';
import { Message } from '../lib/types';
import { User } from '@prisma/client';
import { getNextMessageGPT } from '../ChatBot/ChatBot';

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
    // validate user
    if(!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { content, chatId } = req.body;
    const { id } = req.user as User;

    // make sure chat belongs to user
    const chat = await db.chat.findUnique({
      where: {
        id: chatId
      }
    });
    if(!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if(chat.userId !== id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // get corrected content and next message from GPT
    const { gptResponseText, correctedContent } = await getNextMessageGPT(content, chat);

    if(!gptResponseText) {
      return res.status(500).json({ message: 'Error getting response from GPT' });
    }


    // create messages
    const message = await db.message.create({
      data: {
        content,
        correction: correctedContent,
        chatId,
        authorId: id,
      }
    });
    const chatBotMessage = await db.message.create({
      data: {
        content: gptResponseText,
        chatId,
        authorId: 1,
        type: "RECEIVED"
      }
    });

    // return messages
    res.json({message, chatBotMessage});

  };

}
  