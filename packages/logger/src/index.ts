import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, context }) => {
      return `${timestamp} [${level}]${context ? ` [${context}]` : ''} ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});
