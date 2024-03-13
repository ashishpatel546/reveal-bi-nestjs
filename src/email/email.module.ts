import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import {MailerModule} from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomEmailService } from './email.custom.service';

@Global()
@Module({
  imports: [ MailerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService)=>({
      transport:{
        host: config.get('MAIL_HOST'),
        auth: {
          user: config.get('MAIL_USER'),
          pass: config.get('MAIL_PASSWORD')
        },
      },
      defaults:{
        from: config.get('FROM_EMAIL_ID')
      },
      // template: {
      //   dir: join(__dirname,'../', 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   }
      // }
    })
  }), 
],
  providers: [EmailService, CustomEmailService],
  exports: [EmailService]
})
export class EmailModule {}
