import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 4001;

///fetching database evertime think two problems
// 1)database is in other country it takes time to Comment
// 2)it may provide errors

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sever is listening in the port : ${PORT}..`);
    });
  })
  .catch((error) => {
    console.log("Mongo Connection Error..", error);
  });
