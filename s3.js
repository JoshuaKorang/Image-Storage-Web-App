const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// In s3.js
function getImageStream(image_key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: image_key,
  };

  const readStream = s3.getObject(params).createReadStream();

  readStream.on('error', (err) => {
    if (err.code === 'NoSuchKey') {
      console.error('The specified key does not exist:', image_key);
    } else {
      console.error('Error getting the image from S3:', err);
    }
  });

  return readStream;
}

function deleteImage(imageKey) {
  return s3.deleteObject({ Bucket: bucketName, Key: imageKey }).promise();
}

module.exports = { s3, getImageStream, deleteImage };
