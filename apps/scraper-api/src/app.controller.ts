import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppService } from './app.service';
import { HelloDto } from './hello.dto';
import { ScrapeJob, SCRAPE_QUEUE_NAME, SCRAPE_JOB_NAME } from '@repo/jobs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue(SCRAPE_QUEUE_NAME) private scrapeQueue: Queue,
  ) {}

  @Get()
  getHello(): HelloDto {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post('scrape')
  async queueScrape(@Body() job: ScrapeJob) {
    await this.scrapeQueue.add(SCRAPE_JOB_NAME, job);
    return { status: 'queued', job };
  }
}
