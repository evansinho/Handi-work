/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const s3Storage = multerS3({
  s3,
  bucket: 'artisan-portfolio',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `portfolio/${Date.now()}-${file.originalname}`);
  },
});

function multerS3(arg0: {
  s3: AWS.S3;
  bucket: string;
  metadata: (req: any, file: any, cb: any) => void;
  key: (req: any, file: any, cb: any) => void;
}) {
  throw new Error('Function not implemented.');
}
