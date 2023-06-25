import { GPTResponseType, MessageTypes } from "../lib/types";
import { db } from "../utils/db.server";
import { Message } from "@prisma/client";
import {
  openai,
  MODEL,
  newChatPrompt,
  continueChatPrompt,
  correctTyposPrompt,
} from "./config";
import { ChatCompletionRequestMessage } from "openai";
import { Chat } from "@prisma/client";
import logger from "../utils/logger";

const isGPTMessage = (message: Message): boolean => {
  return message.authorId === 1;
};

const getInitialMessageGPT = async (title: string): Promise<string> => {
  const gptResponse = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: newChatPrompt(title),
      },
    ],
    max_tokens: 150,
  });

  logger.info(`Initial message choices: ${gptResponse.data.choices.map((choice) => choice.message?.content).join(', ')}`);

  return gptResponse.data.choices[0].message?.content!;
};

const getNextMessageGPT = async (
  content: string,
  chat: Chat
) => {
  const { id, title } = chat;

  // get messages
  const messages = await db.message.findMany({
    where: {
      chatId: id,
    },
  });

  // const correctedContent = await getTypoResponse(title, content, messages);
  const response = await getGPTResponse(
    title,
    content,
    messages
  );

  try {
    // try to parse response text
    const parsedResponse = JSON.parse(response);
    const { Message: gptResponseText, Correction: correctedContent } = parsedResponse;
    return { gptResponseText, correctedContent };
  }
  catch (err) {
    // if response text is not JSON, return it
    logger.error(`Error parsing response text: ${err}`);
    return { gptResponseText: undefined, correctedContent: undefined };
  }
  
};

const getTypoResponse = async (
  title: string,
  content: string,
  messages: Message[]
): Promise<string> => {
  // formatted prompt for GPT
  const formattedPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: correctTyposPrompt(title),
  };

  // format: "Message: <message>"
  const formattedMessages: ChatCompletionRequestMessage[] = messages.map(
    (message) => {
      return message.authorId == 1
        ? {
            role: "assistant",
            content: `Message: ${message.content!}\n Correction: ${message.correction!}`,
          }
        : {
            role: "user",
            content: message.content!,
          };
    }
  );

  // get the response from GPT
  const gptResponse = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      formattedPrompt,
      ...formattedMessages,
      {
        role: "user",
        content: `Message: ${content}`,
      },
    ],
    max_tokens: 150,
  });

  console.log(`Typo response choices: ${gptResponse.data.choices.map((choice) => choice.message?.content).join(', ')}`);

  return gptResponse.data.choices[0].message?.content!;
};

const getGPTResponse = async (
  title: string,
  content: string,
  messages: Message[]
): Promise<string> => {
  const formattedPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: continueChatPrompt(title),
  };

  // format: "Message: <message>\n Correction: <correction>"
  const formattedMessages: ChatCompletionRequestMessage[] = messages.map(
    (message) => {
      return message.authorId == 1
        ? {
            role: "assistant",
            content: `{ "Message": "${message.content!}", "Correction": "${message.correction!}" }`,
          }
        : {
            role: "user",
            content: message.content!,
          };
    }
  );

  const gptResponse = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      formattedPrompt,
      ...formattedMessages,
      { role: "user", content: `Message: ${content}` }
    ],
    max_tokens: 150,
  });

  logger.info(`GPT response choices: ${gptResponse.data.choices.map((choice) => choice.message?.content!).join(', ')}`);
  logger.info(gptResponse.data.choices);

  return gptResponse.data.choices[0].message?.content!;
};

// const createChatBotMessage = async (content: string | null, chatId: number) => {
//   // get chat and messages
//   const chat = await db.chat.findUnique({
//     where: {
//       id: chatId,
//     },
//   });

//   const messages = await db.message.findMany({
//     where: {
//       chatId,
//     },
//   });

//   if (content) {
//     // get the typo corrected message from GPT
//     const gptTypoResponse = await openai.createChatCompletion({
//       model: MODEL,
//       messages: [
//         {
//           role: "system",
//           content:
//             `Correct the typos in a spanish message. If there are no typos, output the original string. Only send the corrected message. \n\n Message: ${content}`,
//         },
//       ],
//       max_tokens: 150,
//     });
//     console.log(
//       "gptTypoResponse: ",
//       gptTypoResponse.data.choices[0].message?.content
//     );
//     const gptTypoFixed = gptTypoResponse.data.choices[0].message?.content!;

//     const formattedMessages = `${messages
//       .map(
//         (message) =>
//           `${message.authorId == 1 ? "Friend" : "You"}: ` + message.content!
//       )
//       .join("\n")}\nYou: ${gptTypoFixed}\nFriend:`;
//     console.log("formattedMessages: ", formattedMessages);

//     // get the response from GPT
//     const gptResponse = await openai.createCompletion({
//       model: MODEL,
//       prompt: formattedMessages,
//       max_tokens: 150,
//     });

//     const gptResponseText = gptResponse.data.choices[0].text!;
//     console.log("gptResponseText: ", gptResponseText);

//     return { gptTypoFixed, gptResponseText };

//   } else {
//     // no content, so new chat
//     const gptResponse = await openai.createChatCompletion({
//       model: MODEL,
//       messages: [
//         {
//           role: "system",
//           content: newChatPrompt(chat!.title),
//         },
//       ],
//       max_tokens: 150,
//     });
//     const gptResponseText = gptResponse.data.choices[0].message?.content!;
//     console.log("gptResponseText: ", gptResponseText);

//     return { gptTypoFixed: null , gptResponseText };
//   }

// };

// async function formatMessages(
//   messages: Message[],
//   title: string,
//   content: string
// ): Promise<ChatCompletionRequestMessage[]> {
//   const messagesRequest: ChatCompletionRequestMessage[] = await messages.map(
//     (message) => {
//       return {
//         role: message.authorId == 1 ? "assistant" : "user",
//         content: message.content!,
//       };
//     }
//   );

//   return [{ role: "system", content: prompt(title) }, ...messagesRequest];
// }

export { getInitialMessageGPT, getNextMessageGPT };
