import { Injectable, Logger } from '@nestjs/common';

import {createTransport} from 'nodemailer'

@Injectable()
export class CustomEmailService{

    transport = createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            pass: `${process.env.MAIL_PASSWORD}`
        }
    })

    async sendEmailAsAttachmentFromS3(to:string | string[], from:string, subject:string, text: string, fileName:string, url:string){
            try {
                return this.transport.sendMail({
                    to:to,
                    from: from,
                    subject: subject,
                    text: text,
                    attachments:[{
                        path: url,
                        filename: fileName
                    }]
                })
            } catch (error) {
                Logger.log(error.message)
            }
    }

    async sendTextInEmail(to:string | string[], from:string, subject:string, text: string){
        try {
            return this.transport.sendMail({
                to:to,
                    from: from,
                    subject: subject,
                    text: text,
            })
        } catch (error) {
            Logger.error(error.messge)
        }
    }
}