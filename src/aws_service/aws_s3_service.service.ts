import { Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { AwsConfig } from 'src/shared/config/awsconfig';

interface CORS_Policy{
  AllowedMethods: string[],
  AllowedOrigins: string[]
  AllowedHeaders?: string[],
}


@Injectable()
export class AwsS3Service {

  private readonly AWS_S3_BUCKET = this.awsConfig.awsS3Bucket;
  private logger = new Logger(AwsS3Service.name)
  private readonly s3 = new aws.S3({
    accessKeyId: this.awsConfig.awsS3Accesskey,
    secretAccessKey: this.awsConfig.awsS3SecretKey,
    region: this.awsConfig.awsS3Region,
  });
  constructor(
    private readonly awsConfig : AwsConfig
  ){}


  async uploadFileInPdf(filename: string, fileBuffer: Buffer) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filename,
      Body: fileBuffer,
      // ACL: "public-read",
      ContentType: 'application/pdf',
    };
    try {
      await this.s3.upload(params).promise();
    } catch (error) {
      this.logger.error('error while uploading file on s3');
      this.logger.error(error);
    }
  }

  async uploadfileInCsv(filename: string, fileBuffer: Buffer) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filename,
      Body: fileBuffer,
    };
    try {
      await this.s3.upload(params).promise();
    } catch (error) {
      this.logger.error('error while uploading file on s3');
      this.logger.error(error);
    }
  }

  getSignedUrl(key: string, expires?: number) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
      Expires: expires,
    };
    return this.s3.getSignedUrl('getObject', params);
  }

  deleteMultipleObjects(keys: string[]) {
    const objects_keys = [];
    keys.forEach((key) => {
      objects_keys.push({ Key: key });
    });
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      Delete: {
        Objects: objects_keys,
        Quiet: true || false,
      },
    };
    try {
      return this.s3.deleteObjects(params).promise();
    } catch (error) {
      this.logger.error('error while deleting the objects from s3');
      this.logger.error(error);
    }
  }

  getBucketObjects(keyOrPrefix: string) {
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      Prefix: keyOrPrefix,
    };
    return this.s3.listObjects(params).promise();
  }

  uploadJsonInTxt(filename: string, data: string) {
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filename,
      Body: data,
    };
    return this.s3.putObject(params).promise();
  }

  
  async setCorsPolicy(cors_policy: CORS_Policy){
    let params ={
      Bucket: this.AWS_S3_BUCKET,
      CORSConfiguration:{
        CORSRules:[
          {
            AllowedMethods: cors_policy.AllowedMethods,
            AllowedOrigins: cors_policy.AllowedOrigins
          }
        ]
      }
    }
    if (cors_policy.AllowedHeaders){
      params.CORSConfiguration.CORSRules[0]['AllowedHeaders']= cors_policy.AllowedHeaders
    }
    try {
      await this.s3.putBucketCors(params).promise()
    } catch (error) {
      this.logger.error(error.message)
      this.logger.error('unable to set cors policy')
    }
    
  }
}


