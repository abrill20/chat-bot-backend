// message router
import express from 'express';
import { Request, Response } from 'express';
import { MessageController } from '../controllers/messageController';

export const messageRouter = express.Router();

messageRouter.get('/', MessageController.getAllMessages);

messageRouter.get('/:id', MessageController.getMessageById);

messageRouter.post('/', MessageController.createMessage);




// export message Routes
export default messageRouter;
