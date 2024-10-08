import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import fs from "fs";
import * as http from "http";
import moment from "moment-timezone";
import * as path from "path";
import { defaultDateFormat, defaultTimezone } from "./configs/app.config";
import { errorHandler } from "./middlewares/error-handler.middle";
import { sequelize, testDBConnection, syncDatabase } from "./configs/db";

// importing modules
import * as userModule from "./modules/user";
import * as ecommerceModule from "./modules/ecommerce";

export default async function appFactory(): Promise<Application> {
  // express app init
  const app: Application = express();

  // enabling cors
  app.use(cors());

  //fixed timezone
  moment().tz(defaultTimezone).format(defaultDateFormat);

  // body parser config
  const jsonParser: any = json({
    inflate: true,
    limit: "10mb",
    type: "application/json",
    verify: (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      buf: Buffer,
      encoding: string
    ) => {
      return true;
    },
  });

  // Sync the models after the connection is established
  await testDBConnection();

  // using json parser and urlencoder
  app.use(jsonParser);
  app.use(urlencoded({ extended: true }));

  // for handling uncaught exception from application
  process.on("uncaughtException", (err) => {
    console.error("[ERROR] Uncaught Exception : ", err.message);
    // throw new Error(`[ERROR] Uncaught Exception : ${err.message}`);
  });

  process.on("unhandledRejection", (error: any) => {
    console.error("[ERROR] From event: ", error?.toString());
    throw new Error(`[ERROR] From event: ${error?.toString()}`);
  });

  /**
   * Register Modules
   */
  userModule.init(app);
  ecommerceModule.init(app);

  /**
   * Register Error Handler
   */
  app.use(errorHandler as any);

  return app;
}
