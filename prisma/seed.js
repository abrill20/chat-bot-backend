"use strict";
// seed database with sample data
Object.defineProperty(exports, "__esModule", { value: true });
const db_server_1 = require("../src/utils/db.server");
const seedData_1 = require("./seedData");
async function main() {
    console.log('Seeding database...');
    // seed users
    for (const user of seedData_1.users) {
        await db_server_1.db.user.upsert({
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
    const allUsers = await db_server_1.db.user.findMany();
    console.log(seedData_1.users);
    // seed chats
    for (const chat of seedData_1.chats) {
        await db_server_1.db.chat.create({
            data: {
                title: chat.title,
                userId: allUsers[0].id
            }
        });
    }
    const allChats = await db_server_1.db.chat.findMany();
    console.log(seedData_1.chats);
    // seed messages
    for (const message of seedData_1.messages) {
        await db_server_1.db.message.create({
            data: {
                content: message.content,
                authorId: allUsers[0].id,
                chatId: allChats[0].id
            }
        });
    }
    const allMessages = await db_server_1.db.message.findMany();
    console.log(seedData_1.messages);
    console.log('Database seeded!');
}
main();
