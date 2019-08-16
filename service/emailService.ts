import * as rp from "request-promise";
import { logger } from '../logger';
import * as fs from 'fs';
import path from 'path';
import { GetConfigInstance } from '../config';
import * as HttpStatusCodes from "../dataModel/HttpStatusCodes";

const _moduleTag = "EmailService";
export class EmailService {
  private sendMail = async (receivers: string[], subject: string, content: string, attachments?: File[]) => {
    const _funTag = _moduleTag + "_sendMail";
    let reqOptions = {
      body: {
        receivers: receivers,
        subject: subject,
        content: content,
        attachments: attachments
      },
      json: true,
      method: "POST",
      timeout: 10000,
      uri: GetConfigInstance().PushNotitificationService + "/mail/info",
    };
    return new Promise((resolve, reject) => {
      let startTime = Date.now();
      rp.post(reqOptions, (err, res, body) => {
        let elapsed = Date.now() - startTime;
        if (err || res.statusCode !== HttpStatusCodes.default.OK) {
          logger.error(_funTag, {
            msg: err,
            url: reqOptions.uri,
          });
          return resolve(false); // reject(false);
        }
        logger.debug(_funTag, { elapsed, status: res.statusCode });
        return resolve(true);
      }).catch((err) => {
        console.error(_funTag, {
          msg: err,
          url: reqOptions.uri,
        });
        return resolve(false); // reject(false);
      });
    });
  }


  public sendConfirmMail = (recipient: string, userId: number, ticket: string) => {

    this.sendMail([recipient], 'Please confirm your Letstalk account', this.getConfirmContent(recipient, userId, ticket));
  }
  private getConfirmContent = (recipient: string, userId: number, ticket: string) => {
    const html = path.resolve('public/mail/email_confirm_account_eng.html');
    let content = fs.readFileSync(html, 'utf8');
    content = content.replace(new RegExp(Title.BRAND_NAME_PREFIX, 'g'), 'Letstalk');
    content = content.replace(new RegExp(Title.IOS_DOWNLOAD_URL_PREFIX, 'g'), 'https://letstalk.net/dl/');
    content = content.replace(new RegExp(Title.ANDROID_DOWNLOAD_URL_PREFIX, 'g'), 'https://letstalk.net/dl/');
    content = content.replace(new RegExp(Title.WINDOW_DOWNLOAD_URL_PREFIX, 'g'), 'https://letstalk.net/dl/');
    content = content.replace(new RegExp(Title.MAC_DOWNLOAD_URL_PREFIX, 'g'), 'https://letstalk.net/dl/');
    content = content.replace(new RegExp(Title.EMAIL_PREFIX, 'g'), recipient);
    content = content.replace(new RegExp(Title.IT_BACKEND_URL_PREFIX, 'g'), GetConfigInstance().PortalWebUrl + '/thanks?est=' + ticket + '&userId=' + userId);
    return content;
  }

  public sendServerErrorMail = (recipient: string, content: string) => {
    
    this.sendMail([recipient], content, content);
  }

  public sendPasswordMail = (recipient: string, password: string) => {

    this.sendMail([recipient], 'You\'re password', password);
  }

}

export const emailService = new EmailService();

enum Title {
  BRAND_NAME_PREFIX = "{{brand_name}}",
  IT_BACKEND_URL_PREFIX = "{{it_backend_url}}",
  IOS_DOWNLOAD_URL_PREFIX = "{{ios_download_url}}",
  ANDROID_DOWNLOAD_URL_PREFIX = "{{android_download_url}}",
  WINDOW_DOWNLOAD_URL_PREFIX = "{{window_download_url}}",
  MAC_DOWNLOAD_URL_PREFIX = "{{mac_download_url}}",
  DOWNLOAD_PAGE_URL_PREFIX = "{{download_page_url}}",
  USER_NAME_PREFIX = "{{user_name}}",
  EMAIL_PREFIX = "{{email}}",
  ENTERPRISE_NAME_PREFIX = "{{enterprise_name}}",
  CODE_PREFIX = "{{code}}",
  NICKNAME_PREFIX = "{{nickname}}"
}
