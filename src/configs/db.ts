import { Sequelize } from "sequelize-typescript";
import path from "path";
import { dbHost, dbPort, dbUser, dbPassword, dbName } from "./app.config";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: dbHost,
  port: Number(dbPort),
  username: dbUser,
  password: dbPassword,
  database: dbName,
  models: [path.join(__dirname, "../models")],
});

export const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("[DATABASE SERVER] Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export const syncDatabase = async () => {
  try {
    // Create the schema if it doesn't exist
    await sequelize.query("CREATE SCHEMA IF NOT EXISTS users");
    await sequelize.query("CREATE SCHEMA IF NOT EXISTS ecommerce");

    await sequelize.sync({ force: false });
    console.log(
      "[DATABASE SYNC] Database synced successfully with alterations"
    );
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
};

export { sequelize };
