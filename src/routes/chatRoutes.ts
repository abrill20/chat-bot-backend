// chat routes
import express from 'express';
import { ChatController } from '../controllers/chatController';

export const chatRouter = express.Router();

chatRouter.get('/', ChatController.getAllChats);

chatRouter.get('/:id', ChatController.getChatById);

chatRouter.post('/', ChatController.createChat);

chatRouter.get('/:id/messages', ChatController.getChatMessagesById);



