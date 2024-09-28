import { Client } from "pg";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import {
  dbUser,
  dbHost,
  dbName,
  dbPassword,
  dbPort,
} from "../configs/app.config";

const client = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: Number(dbPort),
});

async function connectDb() {
  try {
    await client.connect();
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

async function insertDataIntoTable(
  tableName: string,
  columns: string[],
  csvFilePath: string
) {
  return new Promise<void>((resolve, reject) => {
    const filePath = path.join(__dirname, csvFilePath);
    const queries: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const values = columns.map((col) => row[col]);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const query = `INSERT INTO ${tableName} (${columns.join(
          ", "
        )}) VALUES (${placeholders})`;
        queries.push(
          client
            .query(query, values)
            .catch((err) => console.error("Error inserting data:", err)) as any
        );
      })
      .on("end", async () => {
        try {
          await Promise.all(queries);
          console.log(`Data inserted into ${tableName} from ${csvFilePath}`);
          resolve();
        } catch (err) {
          console.error(`Error inserting data into ${tableName}:`, err);
          reject(err);
        }
      });
  });
}

async function main() {
  await connectDb();

  try {
    // Insert data into the users table without id
    await insertDataIntoTable(
      '"users"."user"',
      [
        "username",
        "password",
        "is_active",
        "person_id",
        "role_id",
        "order_count",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
      ],
      "./data/users.csv"
    );

    // Insert data into the products table without id
    await insertDataIntoTable(
      '"ecommerce"."products"',
      [
        "name",
        "price",
        "stock",
        "category_id",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
      ],
      "./data/products.csv"
    );

    // Insert data into the orders table without id
    await insertDataIntoTable(
      '"ecommerce"."orders"',
      [
        "user_id",
        "order_date",
        "status",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
      ],
      "./data/orders.csv"
    );

    // Insert data into the order_items table without id
    await insertDataIntoTable(
      '"ecommerce"."order_items"',
      [
        "order_id",
        "product_id",
        "quantity",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
      ],
      "./data/order_items.csv"
    );

    // Insert data into the categories table without id
    await insertDataIntoTable(
      '"ecommerce"."categories"',
      ["name", "created_by", "created_at", "updated_by", "updated_at"],
      "./data/categories.csv"
    );
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

main().catch((err) => console.error("Error in main function:", err));
