import winston from "winston";
import path from "path";
import { NextFunction, Request, Response } from "express";

// use logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join(__dirname, "logs", "requests.log")
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "errors.log")
    }),
  ],
});

// export logger
export default logger;

// export logger middleware
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.log('info', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    body: req.body
  });
  next();
}
