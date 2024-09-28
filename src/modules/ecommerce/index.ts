import { Application } from "express";
import productRouter from "./routes/product.route";

export function init(app: Application) {
  app.use("/product", productRouter);
}
