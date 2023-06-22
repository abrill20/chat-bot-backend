// chat controller
import { Request, Response } from 'express';
// db client
import { db } from '../utils/db.server';
import { Chat } from '../lib/types';
import { User } from '@prisma/client';
import createChatBotMessage from '../ChatBot/ChatBot';

export class ChatController {
  static getUserChats = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // get user id from request
    const { id } = req.user as User;
    
    // get chats from database
    const chats = await db.chat.findMany({
      where: {
        userId: id
      }
    });
    res.json(chats);
  }


  // todo: add auth middleware
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
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.user as User;
    const { title } = req.body;
    const chat = await db.chat.create({
      data: {
        title,
        userId: id
      }
    });

    const gptResponseJSON = await createChatBotMessage(null, chat.id);
    const response = await db.message.create({
      data: {
        content: gptResponseJSON.response,
        chatId: chat.id,
        authorId: 1,
        type: "RECEIVED"
      }
    });
    res.json({chat, response});
  }

  static deleteChat = async (req: Request, res: Response) => {
    // make sure user is same as chat owner
    console.log('deleteChat')
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // get chat from database
    const { id } = req.params;
    const chat = await db.chat.findUnique({
      where: {
        id: Number(id)
      }
    });
    // check if user is chat owner
    if (chat?.userId !== (req.user as User).id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // delete chat from database and cascade delete messages
    await db.chat.delete({
      where: {
        id: Number(id)
      }
    });
    res.json({ message: 'Chat deleted'
    })
  }

  static getChatMessagesById = async (req: Request, res: Response) => {
    // get chat messages from database
    console.log('getChatMessagesById');
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