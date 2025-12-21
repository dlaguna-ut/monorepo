import { Injectable } from '@nestjs/common';
import { HelloDto } from './hello.dto';

@Injectable()
export class AppService {
  getHello(): HelloDto {
    return { message: 'Hello World!' };
  }
}
