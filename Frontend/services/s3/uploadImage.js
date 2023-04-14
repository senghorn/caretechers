import S3 from 'aws-sdk/clients/s3';
import aws from '../../constants/aws';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import Base64Binary from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads content given to s3 bucket and returns the url to that uploaded content.
 * @param {Object} content 
 * @returns 
 */
const uploadImage = (content) => {
  console.log('uploading');
  const imageName = uuidv4();
  const s3 = new S3({
    accessKeyId: aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: aws.AWS_SECRET_ACCESS_KEY,
    region: aws.AWS_REGION,
    signatureVersion: 'v4',
  });

  const uploadedUrl = `https://care-image.s3-${aws.AWS_REGION}.amazonaws.com/${imageName}.jpeg`;

  const buffer = Buffer.from(content, 'base64');
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: 'care-image',
        Key: `${imageName}.jpeg`,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      },
      (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(uploadedUrl);
        }
      }
    );
  });
};

export default uploadImage;
