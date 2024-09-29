import { Application } from "express";
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import askLLMRouter from "./routes/ask-lmm.route";

export function init(app: Application) {
  app.use("/product", productRouter);
  app.use("/order", orderRouter);
  app.use("/llm", askLLMRouter);
}
