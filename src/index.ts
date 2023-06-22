import express from "express";
import { Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { userRouter } from "./routes/userRoutes";
import { messageRouter } from "./routes/messageRoutes";
import FileStore from "session-file-store";
//import cors
import cors from "cors";
// import authentication
import passport from "./Auth/passport"

import dotenv from "dotenv";
import { chatRouter } from "./routes/chatRoutes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use cors
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(
  session({
    secret: "secret",
    store: new (FileStore(session))(),
    resave: false,
    saveUninitialized: false,
  })
);

// use passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/chat", chatRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
