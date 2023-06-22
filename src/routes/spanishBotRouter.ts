// spanishbot router
import express from 'express';
import { SpanishBotController } from '../controllers/spanishBotController';

export const spanishBotRouter = express.Router();

spanishBotRouter.post('/', SpanishBotController.createSpanishBotFromPrompt);

spanishBotRouter.post('/message', SpanishBotController.createSpanishBotMessage);