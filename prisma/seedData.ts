// seed data

import { Prisma } from "@prisma/client";

export const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password1",
  },
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: "password2",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    password: "",
  },
  {
    name: "Sally Smith",
    email: "sally.smith@example.com",
    password: "",
  },
  {
    name: "Joe Bloggs",
    email: "joe.bloggs@example.com",
    password: "password3",
  },
];

export const chats = [
  {
    title: "Chat 1",
  },
  {
    title: "Chat 2",
  },
  {
    title: "Chat 3",
  },
  {
    title: "Chat 4",
  },
  {
    title: "Chat 5",
  },

];

// 20 example messages
export const messages = [
  {
    content: "Hello, world!"
  },
  {
    content: "How are you?"
  },
  {
    content: "I'm good, thanks!"
  },
  {
    content: "What are you up to?"
  },
  {
    content: "Not much."
  },
  {
    content: "How about you?"
  },
  {
    content: "Same here."
  },
  {
    content: "Cool."
  },
];