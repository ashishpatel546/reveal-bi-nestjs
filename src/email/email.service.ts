import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomEmailService } from './email.custom.service';
import { ApiConfigService } from 'src/shared/config/config.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private fromEmail: string = this.apiConfig.getFromEmail
  constructor(
    private mailService: MailerService,
    private customEmailService: CustomEmailService,
    private readonly apiConfig: ApiConfigService
  ) {}

  async sendEmailText(to: string, subject: string, html: string) {
    
    try {
      await this.mailService.sendMail({
        to: to,
        from: this.fromEmail,
        subject: subject,
        html: html,
      });
      return 'success'
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to send email');
      return 'fail'
    }
  }


  async sendEmailAsAttachment(
    to: string | string[],
    from: string,
    subject: string,
    text: string,
    fileName: string,
    url: string,
  ) {
    try {
      await this.customEmailService.sendEmailAsAttachmentFromS3(
        to,
        from,
        subject,
        text,
        fileName,
        url,
      );
      return 'success';
    } catch (error) {
      this.logger.error('unable to send email');
      this.logger.error(error.message);
    }
  }

  async sendTextThroughEmail(
    to: string | string[],
    from: string,
    subject: string,
    text: string,
  ) {
    try {
      await this.customEmailService.sendTextInEmail(to, from, subject, text);
      return 'success';
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to send email');
    }
  }
}
