import {db} from "../src/utils/db.server";
import {Chat, Message, User} from "../src/lib/types";

async function seed() {
  await Promise.all(
    users.map(user => {
      db.user.create({
        data: {
          name: user.username,
          email: user.email,
          password: user.password
        }
      })
    })
  );
  
  const user = await db.user.findFirst({
    where: {
      email: "JohnDoe@example.com"
    }
  });

  if(user) {
  await Promise.all(

    chats.map(chat => {
      db.chat.create({
        data: {
          title: chat.title,
          userId: user.id
        }
      })
    })
  );
  }

}
const users: User[] = [
  {
    username: "John",
    email: "JohnDoe@example.com",
    password: "password"
  },
  {
    username: "Jane",
    email: "JohnDoe@example.com",
    password: "password"
  },
  {
    username: "Bob",
    email: "BobDoe@example.com",
    password: "password"
  }
]

const chats: Chat[] = [
  {
    title: "Chat 1",
    userId: 1
  },
  {
    title: "Chat 2",
    userId: 2
  },
  {
    title: "Chat 3",
    userId: 3
  }]