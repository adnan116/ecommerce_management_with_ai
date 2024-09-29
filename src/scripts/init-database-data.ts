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
} from "../configs/app.config"; // Adjust the path as necessary

const client = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: Number(dbPort),
});

// Function to connect to the database
async function connectDb() {
  try {
    await client.connect();
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

// Function to insert data into a table from a CSV file
async function insertDataIntoTable(
  tableName: string,
  columns: string[],
  csvFilePath: string
) {
  return new Promise<void>((resolve, reject) => {
    const filePath = path.join(__dirname, csvFilePath);
    const queries: Promise<any>[] = []; // Array to hold insert promises

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const values = columns.map((col) => row[col]);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const query = `INSERT INTO ${tableName} (${columns.join(
          ", "
        )}) VALUES (${placeholders})`;

        // Push each insert promise to the array
        queries.push(
          client.query(query, values).catch((err) => {
            console.error("Error inserting data:", err);
          })
        );
      })
      .on("end", async () => {
        try {
          await Promise.all(queries); // Wait for all insert operations to complete
          console.log(`Data inserted into ${tableName} from ${csvFilePath}`);
          resolve();
        } catch (err) {
          console.error(`Error inserting data into ${tableName}:`, err);
          reject(err);
        }
      })
      .on("error", (err) => {
        console.error(`Error reading CSV file ${csvFilePath}:`, err);
        reject(err);
      });
  });
}

// Main function to execute the data insertion
async function main() {
  await connectDb(); // Connect to the database

  try {
    // Insert data into the feature table
    await insertDataIntoTable(
      '"users"."feature"',
      ["id", "feature_name", "is_active"],
      "./data/features.csv"
    );

    // Insert data into the role table
    await insertDataIntoTable(
      '"users"."role"',
      ["id", "role_name", "description"],
      "./data/roles.csv"
    );

    // Insert data into the role_feature table
    await insertDataIntoTable(
      '"users"."role_feature"',
      ["id", "role_id", "feature_id"],
      "./data/role_features.csv"
    );

    // Insert data into the person_info table
    await insertDataIntoTable(
      '"users"."person_info"',
      [
        "id",
        "first_name",
        "last_name",
        "dob",
        "phone_number",
        "email",
        "gender",
        "religion",
        "profile_picture",
      ],
      "./data/person_info.csv"
    );

    // Insert data into the user table
    await insertDataIntoTable(
      '"users"."user"',
      [
        "id",
        "username",
        "password",
        "is_active",
        "person_id",
        "role_id",
        "order_count",
      ],
      "./data/users.csv"
    );

    // Insert data into the categories table
    await insertDataIntoTable(
      '"ecommerce"."categories"',
      ["id", "name"],
      "./data/categories.csv"
    );

    // Insert data into the products table
    await insertDataIntoTable(
      '"ecommerce"."products"',
      ["id", "name", "price", "stock", "category_id"],
      "./data/products.csv"
    );

    // Insert data into the orders table
    await insertDataIntoTable(
      '"ecommerce"."orders"',
      ["id", "user_id", "order_date", "status"],
      "./data/orders.csv"
    );

    // Insert data into the order_items table
    await insertDataIntoTable(
      '"ecommerce"."order_items"',
      ["id", "order_id", "product_id", "quantity"],
      "./data/order_items.csv"
    );
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.end(); // Close the database connection
    console.log("Database connection closed.");
  }
}

// Execute the main function and handle any errors
main().catch((err) => console.error("Error in main function:", err));
