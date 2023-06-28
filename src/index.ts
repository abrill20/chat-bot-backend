import express from "express";
import { Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { userRouter } from "./routes/userRoutes";
import { messageRouter } from "./routes/messageRoutes";
import { chatRouter } from "./routes/chatRoutes";
import { loggerMiddleware } from "./utils/logger";
import FileStore from "session-file-store";
//import cors
import cors from "cors";
// import authentication
import passport from "./Auth/passport"
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(loggerMiddleware)

// use cors
// const whitelist: string = (process.env.NODE_ENV == "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV) as string;
const whitelist = ["http://localhost:5173", "http://localhost:4173", "https://www.hablando.app", "https://hablando.app"];
app.use(cors({
  origin: whitelist,
  credentials: true
}));



app.enable("trust proxy");
// set cache-control: private
app.use((req: Request, res: Response, next) => {
  res.set("Cache-Control", "private");
  next();
});

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
  console.log(`Server is running on port:: ${process.env.PORT}`);
});
