import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import { userRouter } from "./routes/userRoutes";
import { messageRouter } from "./routes/messageRoutes";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
