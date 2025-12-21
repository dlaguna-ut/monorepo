import { LoggerService, Injectable } from '@nestjs/common';
import { logger } from '@repo/logger';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    logger.info(message, { context: optionalParams[0] });
  }

  error(message: any, ...optionalParams: any[]) {
    logger.error(message, { context: optionalParams[0] });
  }

  warn(message: any, ...optionalParams: any[]) {
    logger.warn(message, { context: optionalParams[0] });
  }

  debug?(message: any, ...optionalParams: any[]) {
    logger.debug(message, { context: optionalParams[0] });
  }

  verbose?(message: any, ...optionalParams: any[]) {
    logger.verbose(message, { context: optionalParams[0] });
  }
}
