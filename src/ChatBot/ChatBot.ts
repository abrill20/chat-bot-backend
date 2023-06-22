import { format } from "path";
import { GPTResponseType, MessageTypes } from "../lib/types";
import { db } from "../utils/db.server";
import { Message } from ".prisma/client";

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const OPEN_AI_ORGANIZATION = process.env.OPEN_AI_ORGANIZATION;
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
  organization: process.env.OPEN_AI_ORGANIZATION,
});

const MODEL = "gpt-3.5-turbo";

// const prompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: I'd like to book a hotel in Berlin.\nAI:";

// set dynamic prompt that takes in the chat title
const newChatPrompt = (situation: string) => {
  return `Play a character in a given conversation scenario. All messages are in Spanish. Respond only in JSON. Create an initial message to start the conversation.
  
  Scenario: \`\`\`
  ${situation}
  \`\`\`
  Response Format: \`\`\`
  { "response": String }
  \`\`\``;
};

const prompt = (situation: string) => {
  return `Play a character in a given conversation scenario. Your character is polite and friendly. All messages are in Spanish. Respond only in JSON. Respond by fixing the user's typos and responding to their message.
  
  Scenario: \`\`\`
  ${situation}
  \`\`\`
  Response Format (JSON): \`\`\`
  { "corrected_message": <user's message with typos fixed, or empty string if no typos>, "response": <response to message> }
  \`\`\`
  ONLY RESPOND IN JSON.`;
};

const openai = new OpenAIApi(configuration);

const createChatBotMessage = async (content: string | null, chatId: number) => {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
    },
  });

  const messages = await db.message.findMany({
    where: {
      chatId,
    },
  });

  const formattedMessages: ChatCompletionRequestMessage[] = content
    ? await formatMessages(messages, chat?.title!, content)
    : [{ role: "system", content: newChatPrompt(chat?.title!) }];

  console.log("formattedMessages: ", formattedMessages);

  const response = await openai.createChatCompletion(
    {
      model: MODEL,
      messages: formattedMessages,
      max_tokens: 150,
    }

  );

  console.log("response: ", response.data);

  const gptResponse = response.data.choices[0].message?.content;
  console.log("gptResponse: ", gptResponse)
  const gptResponseJSON = JSON.parse(gptResponse!) as GPTResponseType;

  return gptResponseJSON;

};

export default createChatBotMessage;

async function formatMessages(
  messages: Message[],
  title: string,
  content: string
): Promise<ChatCompletionRequestMessage[]> {
  const messagesRequest: ChatCompletionRequestMessage[] = await messages.map(
    (message) => {
      return {
        role: message.authorId == 1 ? "assistant" : "user",
        content: message.content!,
      };
    }
  );

  return [
    { role: "system", content: prompt(title) },
    ...messagesRequest
  ];
}
