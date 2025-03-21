import express from "express";
import ViteExpress from "vite-express";

import { loggingMiddleware } from "@/middleware/logging.middleware";
import { userRouter } from "@/routes/user.route";
import { errorInterceptor } from "./middleware/error.middleware";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

const apiRoutes: express.Router = express.Router();

app.use("/api", apiRoutes);

apiRoutes.use("/user", userRouter);

app.use(errorInterceptor);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
