// spanish bot controller
import { Request, Response } from 'express';
// db client
import { db } from '../utils/db.server';

export class SpanishBotController {

  // TODO: implement createSpanishBotFromPrompt
  static createSpanishBotFromPrompt = async (req: Request, res: Response) => {
    // get user message from request
    const { message } = req.body;

    res.json("TODO");

  }

  static createSpanishBotMessage = async (req: Request, res: Response) => {
    // create spanish bot message
    const { content, userId, chatId } = req.body;
    const message = await db.message.create({
      data: {
        content,
        chatId,
        authorId: userId
      }
    });
    res.json(message);
  }

}