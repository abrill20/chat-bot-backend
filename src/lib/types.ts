// import prisma user type
import { User as PrismaUser } from '@prisma/client';
import { Request } from 'express';

// message types
export enum MessageTypes {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}
// message body type
export type Message = {
  content: string;
  userId: number;
  chatId: number;
  type?: MessageTypes;
};

// user body type
export type User = {
  username: string;
  email: string;
  password: string;
};

export type Chat = {
  title: string;
  userId: number;
  thing?: string;

}

// extent express request type
export interface RequestWithUser extends Request {
  user: PrismaUser;
};

export type GPTResponseType = {
  response: string;
  corrected_message?: string
}