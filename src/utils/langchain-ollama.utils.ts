import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ollamaBaseUrl, modelName } from "../configs/app.config";
import { readTextFile } from "./llm.utils";

const prompt = readTextFile("./prompts/v1.txt");

const promptForJsonMode = ChatPromptTemplate.fromMessages([
  ["system", prompt],
  ["human", `Question: "{question}" `],
]);

const llmJsonMode = new ChatOllama({
  baseUrl: ollamaBaseUrl,
  model: modelName,
  temperature: 0,
});

const llmChainForJsonMode = promptForJsonMode.pipe(llmJsonMode);

export default llmChainForJsonMode;
