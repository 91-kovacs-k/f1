import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is the backend API for the F1 app. Visit the frontend at <a href="http://localhost:3000">http://localhost:3000</a>!';
  }
}
