import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';

@Injectable()
export class ThrottlerService {
  private readonly requestCounts: Map<
    string,
    { count: number; timestamp: Date }
  > = new Map();
  private readonly logger = new Logger(ThrottlerService.name);

  isThrottled(identifier: string): boolean {
    this.logger.log(this.requestCounts);
    const throttleData = this.requestCounts.get(identifier);
    if (!throttleData) return false;
    return true;
  }

  // Method to delete entry for IP
  deleteEntry(identifier: string): void {
    this.logger.log(`Deleting IP: ${identifier}`);
    this.requestCounts.delete(identifier);
  }

  //Method to add entry for IP
  addEntry(identifier: string) {
    this.logger.log(`Adding IP to throttler: ${identifier}`);
    this.requestCounts.set(identifier, { count: 1, timestamp: new Date() });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  deleteOldIpEntry(cleanAll: boolean = false) {
    if (cleanAll) {
      this.logger.log('Cleaning all cache');
      this.requestCounts.clear();
      return;
    }
    this.logger.log('Cleaning throttler old cache');
    this.logger.log(`Cleaning at : ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    for (let [key, value] of this.requestCounts) {
      const { timestamp } = value;
      const timeStampToCompare = moment().subtract(30, 'm');
      if (moment(timestamp).isSameOrBefore(timeStampToCompare)) {
        this.logger.log('Deleting old entries from IP');
        this.deleteEntry(key);
      }
    }
  }
}
