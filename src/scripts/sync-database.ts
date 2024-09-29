import { sequelize } from "../configs/db";

const syncDatabase = async () => {
  try {
    console.log("[DATABASE SYNC] Starting the database synchronization...");

    // Create the schema if it doesn't exist
    await sequelize.query("CREATE SCHEMA IF NOT EXISTS users");
    await sequelize.query("CREATE SCHEMA IF NOT EXISTS ecommerce");

    await sequelize.sync({ force: false });

    setTimeout(() => {
      console.log(
        "[DATABASE SYNC] Database synced successfully with alterations"
      );
    }, 10000);
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
};

syncDatabase();
