// seed database with sample data

import { db } from '../src/utils/db.server';
import { users, chats, messages } from './seedData';

async function main() {
  console.log('Seeding database...');
  // seed users
  for (const user of users) {
    await db.user.upsert({
      where: {
        email: user.email
      },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });
  }

  const allUsers = await db.user.findMany();
  console.log(users);
  
  // seed chats
  for (const chat of chats) {
    await db.chat.create({
      data: {
        title: chat.title,
        userId: allUsers[0].id
      }
    });
  }

  const allChats = await db.chat.findMany();
  console.log(chats);

  // seed messages
  for (const message of messages) {
    await db.message.create({
      data: {
        content: message.content,
        authorId: allUsers[0].id,
        chatId: allChats[0].id
      }
    });
  }

  const allMessages = await db.message.findMany();
  console.log(messages);
  
  console.log('Database seeded!');
}

main()
