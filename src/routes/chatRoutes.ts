// chat routes
import express from 'express';
import { ChatController } from '../controllers/chatController';
import { User } from '.prisma/client';

export const chatRouter = express.Router();



chatRouter.get('/:id', ChatController.getChatById);

chatRouter.post('/', ChatController.createChat);

chatRouter.get('/:id/messages', ChatController.getChatMessagesById);

chatRouter.delete('/:id', ChatController.deleteChat);

chatRouter.get('/', ChatController.getUserChats);





