import winston from "winston";
import "winston-daily-rotate-file";
import { config } from "./env.js";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

export const logger = winston.createLogger({
  level: config.isDevelopment ? "debug" : "info",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});
