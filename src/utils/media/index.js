import settings from 'settings/index';
import fs from 'fs';
import axios from 'axios';
import AWS from 'aws-sdk';
import uuid from 'uuid/v4';
import models from 'models';
import elastic from 'utils/elasticsearch';
import e from 'http-errors';

AWS.config.update({
  accessKeyId: settings.AWS_ACCESS_KEY,
  secretAccessKey: settings.AWS_SECRET_KEY,
});

const unlinkFile = async path => new Promise(resolve => {
  fs.unlink(path, () => {
    resolve();
  });
});

/**
 * Creates a media object in database and uploads the file to S3
 * @param type
 * @param file
 * @returns {Promise<void>}
 */
const uploadMedia = async (type, ownerId, file) => {
  const s3 = new AWS.S3();
  const filename = `${file.fieldname}-${uuid()}-${file.filename}`;

  if (file.mimetype.indexOf('image') !== 0) {
    await unlinkFile(file.path);
    throw new e.BadRequest('errors.onlyImagesAllowed');
  }

  // Create params for putObject call
  const objectParams = {
    Bucket: settings.AWS_UPLOADS_BUCKET_NAME,
    Key: `${settings.MEDIA_PATHS[type]}${filename}`,
    Body: file,
    ACL: 'public-read',
    ContentType: file.mimetype,
    ContentEncoding: file.encoding,
  };

  // Create object upload promise
  const uploadPromise = await s3.upload(objectParams).promise();

  // Save the URL to the database
  const media = await models.Media.create({
    name: uploadPromise.key,
    url: settings.AWS_S3_HOST + uploadPromise.key,
    type,
    used: false,
    userId: ownerId,
  });

  if (media) {
    await unlinkFile(file.path);
  }

  return media;
};

const removeMedia = async (id, ownerId) => {
  const media = await models.Media.findOne({ where: { id } });

  if (!media || media.userId !== ownerId) {
    return false;
  }

  AWS.config.update({
    accessKeyId: settings.AWS_ACCESS_KEY,
    secretAccessKey: settings.AWS_SECRET_KEY,
  });

  // Create object upload promise
  const s3 = new AWS.S3();
  await s3.deleteObject({
    Bucket: settings.AWS_UPLOADS_BUCKET_NAME,
    Key: media.name,
  }).promise();

  await media.destroy();
  return true;
};

const getURLMetadata = async url => {
  const urlData = await elastic.getURLMetadata(url);
  if (urlData) {
    return urlData;
  }

  const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-url')(),
  ]);

  try {
    const { data } = await axios({
      method: 'get',
      url,
    });

    const metadata = await metascraper({ html: data, url });
    await elastic.saveURLMetadata(url, metadata);
    return metadata;
  } catch (err) {
    console.log('Error while fetching URL', err);
    if (err.response) {
      throw e(err.response.status, err.response.data);
    }

    throw e(500, 'error.unexpected');
  }
};

export default {
  uploadMedia,
  removeMedia,
  getURLMetadata,
};
