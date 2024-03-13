import { Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { AwsConfig } from 'src/shared/config/awsconfig';
import { PassThrough, Readable, Stream } from 'stream';
import { stringify } from 'csv-stringify';
import { createCsvString } from 'src/utilities/sharedMethods';

interface CORS_Policy {
  AllowedMethods: string[];
  AllowedOrigins: string[];
  AllowedHeaders?: string[];
}

@Injectable()
export class AwsS3Service {
  private readonly AWS_S3_BUCKET = this.awsConfig.awsS3Bucket;
  private logger = new Logger(AwsS3Service.name);
  private readonly s3 = new aws.S3({
    accessKeyId: this.awsConfig.awsS3Accesskey,
    secretAccessKey: this.awsConfig.awsS3SecretKey,
    region: this.awsConfig.awsS3Region,
  });
  constructor(private readonly awsConfig: AwsConfig) {}

  getS3Object() {
    return this.s3;
  }

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

  async uploadfileInCsv(
    filename: string,
    fileBuffer: Buffer | String | Stream,
  ) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: filename,
      Body: fileBuffer,
      contentType: 'text/csv',
    };
    try {
      await this.s3.upload(params).promise();
    } catch (error) {
      this.logger.error('error while uploading file on s3');
      this.logger.error(error);
    }
  }

  private async uploadMultipartPart(
    uploadId: string,
    partNumber: number,
    data: string,
    key: string,
  ): Promise<AWS.S3.Types.CompleteMultipartUploadOutput> {
    return this.s3
      .uploadPart({
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: data,
      })
      .promise();
  }

   async uploadCsvToS3InChunks(
    key: string,
    data: unknown[],
  ): Promise<void> {
    // Get the total number of data items
    const bucket = this.AWS_S3_BUCKET
    const chunkSize = 100000
    const totalItems = data.length;

    // Initialize start index and processed count
    let start = 0;
    let processed = 0;

    try {
      
    
    // Create a multipart upload
    const multipartUpload = await this.s3
      .createMultipartUpload({
        Bucket: bucket,
        Key: key,
        ContentType: 'text/csv',
      })
      .promise();

    // Array to hold uploaded part information
    const uploadedParts: AWS.S3.CompletedPart[] = [];

    try {
      // Loop until all data items are processed
      while (processed < totalItems) {
        // Calculate the end index of the current chunk
        const end = Math.min(start + chunkSize, totalItems);

        // Get the current chunk of data
        const currentChunk = data.slice(start, end);

        // Create CSV string for the current chunk
        const csvString = await createCsvString(currentChunk, start === 0);

        // Upload the CSV string as a part of the multipart upload
        const partNumber = uploadedParts.length + 1;
        const uploadedPart = await this.uploadMultipartPart(
          multipartUpload.UploadId,
          partNumber,
          csvString,
          key,
        );

        // Add uploaded part information to the array
        uploadedParts?.push({ PartNumber: partNumber, ETag: uploadedPart.ETag });

        // Update the start index and processed count for the next iteration
        start = end;
        processed += currentChunk.length;
      }

      // Complete the multipart upload
      await this.s3
        .completeMultipartUpload({
          Bucket: bucket,
          Key: key,
          MultipartUpload: { Parts: uploadedParts },
          UploadId: multipartUpload.UploadId,
        })
        .promise();
    } catch (err) {
      // Abort the multipart upload on error
      await this.s3
        .abortMultipartUpload({
          Bucket: bucket,
          Key: key,
          UploadId: multipartUpload.UploadId,
        })
        .promise();
      this.logger.error(err.message)
      this.logger.error('Unable to do mulitpart uplload')
    }
  } catch (error) {
      this.logger.error(error.message)
      this.logger.error('Unable to do mulitpart uplload')
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

  async setCorsPolicy(cors_policy: CORS_Policy) {
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedMethods: cors_policy.AllowedMethods,
            AllowedOrigins: cors_policy.AllowedOrigins,
          },
        ],
      },
    };
    if (cors_policy.AllowedHeaders) {
      params.CORSConfiguration.CORSRules[0]['AllowedHeaders'] =
        cors_policy.AllowedHeaders;
    }
    try {
      await this.s3.putBucketCors(params).promise();
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('unable to set cors policy');
    }
  }
}
