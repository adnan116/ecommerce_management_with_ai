import * as fs from "fs";
import path from "path";

export function extractAndCleanSQL(input: string): string {
  // Regular expression to match SQL code blocks
  const codeBlockRegex = /```sql\n([\s\S]*?)```/i;

  // Regular expression to match WITH or SELECT statements
  const sqlRegex = /\b(WITH|SELECT)[\s\S]*?(?:;|\n\n|$)/gi;

  let sqlContent = input;

  // If the input contains a SQL code block, extract its content
  const codeBlockMatch = input.match(codeBlockRegex);
  if (codeBlockMatch) {
    sqlContent = codeBlockMatch[1];
  }

  // Find all SQL statements
  const matches = sqlContent.match(sqlRegex) || [];

  // Clean and join the matches
  return matches
    .map(
      (match) =>
        match
          .replace(/\n/g, " ") // Replace newlines with spaces
          .replace(/\s+/g, " ") // Replace multiple spaces with a single space
          .replace(/\s*([(),])\s*/g, "$1") // Remove spaces around parentheses and commas
          .trim() // Remove leading and trailing spaces
    )
    .join(" ");
}

export function readTextFile(promptPath: string) {
  const promptFilePath = path.resolve(__dirname, promptPath);
  return fs.readFileSync(promptFilePath, "utf8");
}
