import { toCamelKeys, toSnakeCase } from "keys-transform";
import { Service } from "typedi";
import { sequelize } from "../../../configs/db";
import llmChainForJsonMode from "../../../utils/langchain-ollama.utils";
import { extractAndCleanSQL } from "../../../utils/llm.utils";

@Service()
export default class AskLLMService {
  constructor() {}

  async getQuestionAnswerFromAI(question: string) {
    try {
      const response = (await llmChainForJsonMode.invoke({ question })) as any;

      // Extract the generated SQL from the response content and remove newlines
      const generatedSQL = extractAndCleanSQL(response.content);

      const queryExecutedResult = await this.executeSqlQuery(
        generatedSQL as string
      );

      let result = undefined;
      if (!queryExecutedResult) {
        result =
          "Sorry, I couldn't process your request at the moment. Please try again later.";
      }
      // Convert the result to camelCase
      if (Array.isArray(queryExecutedResult)) {
        result = queryExecutedResult.map((data: any) => toCamelKeys(data));
      } else {
        result = queryExecutedResult
          ? toCamelKeys(queryExecutedResult)
          : result;
      }

      return {
        question,
        aiResponse: response.content,
        formatedSql: generatedSQL,
        result,
      };
    } catch (error) {
      throw error;
    }
  }
  async executeSqlQuery(sqlQuery: string) {
    try {
      const queryExecutedResult = await sequelize.query(sqlQuery, {
        type: (sequelize as any).QueryTypes.SELECT,
      });
      return queryExecutedResult;
    } catch (error) {
      return undefined;
    }
  }
}
