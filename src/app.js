import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors is one of the middle ware and every middle ware is used as app.use() method
//for security to avoid access from other servers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //used for network security
    credentials: true,
  })
);
// these are the common middle wares that users send request from the browser in json with limit 16kb and else written in the notion in node js departmnet
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routers
import healthCheck from "./routes/healthCheck.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

app.use("/api/v1/healthCheck", healthCheck);
app.use("/api/v1/users", userRouter);
// app.use(errorHandler)
export { app };
