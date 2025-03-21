import express from "express";
import ViteExpress from "vite-express";

import { loggingMiddleware } from "@/middleware/logging.middleware";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
