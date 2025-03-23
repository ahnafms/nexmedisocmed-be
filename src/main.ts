import express from "express";
import ViteExpress from "vite-express";

import { loggingMiddleware } from "@/middleware/logging.middleware";
import { userRouter } from "@/routes/user.route";
import { errorInterceptor } from "./middleware/error.middleware";
import { postRouter } from "./routes/post.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { commentRouter } from "./routes/comment.routes";
import bodyParser from "body-parser";

const app = express();

ViteExpress.config({ mode: process.env.NODE_ENV || "development" });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggingMiddleware);
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.APP_FE_ORIGIN || "http://localhost:5173"
        : "http://localhost:5173",
  }),
);

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

const apiRoutes: express.Router = express.Router();

app.use("/api", apiRoutes);

apiRoutes.use("/user", userRouter);
apiRoutes.use("/posts", postRouter);
apiRoutes.use("/comments", commentRouter);

app.use(errorInterceptor);

ViteExpress.listen(app, parseInt(process.env.BACKEND_PORT || "3000"), () =>
  console.log("Server is listening on port 3000..."),
);
