import { createLogger, transports, format } from "winston";
const { combine, timestamp, label, prettyPrint, json } = format;

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: combine(label({ label: "info" }), timestamp(), prettyPrint()),
    }),
    new transports.File({
      level: "error",
      filename: "errorServer.log",
      maxsize: 5242880,
      maxFiles: 5,
      format: combine(label({ label: "errorServer" }), timestamp(), json()),
    }),
  ],
});
export default logger;
