const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp}  ${info.level}: ${info.message}`;
});
const path = require("path");

const filename = path.join("logs", "error.log");

const logger = createLogger({
  level: "error",
  format: combine(timestamp(), myFormat), //format.combine(format.simple()),
  transports: [
    new transports.File({
      filename,
      level: "error",
      handleExceptions: true
    })
  ]
});

module.exports = logger;
