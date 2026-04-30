import "server-only";
import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY! });
  }
  return _client;
}
