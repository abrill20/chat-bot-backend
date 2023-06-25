
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
  organization: process.env.OPEN_AI_ORGANIZATION,
});
export const openai = new OpenAIApi(configuration);
export const MODEL = "gpt-3.5-turbo";


export const newChatPrompt = (situation: string) => {
  return `You are a human in a conversation scenario. You only speak Spanish. Start a conversation with a human. Your message should be easy to respond to for a language learner.
  Scenario: \`\`\`
  ${situation}`;
};

export const correctTyposPrompt = (situation: string) => {
  return `Correct the typos in a spanish message. If there are no typos, output the original string. Only send the corrected message.

  Scenario: \`\`\`
  ${situation}
  \`\`\`
  Only send the corrected message.`;
};

export const continueChatPrompt = (situation: string) => {
  return `You are a human in a conversation scenario. You only speak spanish. You only respond in JSON. Correct the user's typos and respond to their message.
  
  Scenario: \`\`\`
  ${situation}
  \`\`\`
  Response Format (JSON): \`\`\`
  { "Message": <your response>, "Correction": <user message corrected> }
  \`\`\``;
};