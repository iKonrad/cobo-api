const STATUSES = require('http-status-codes');
const MEDIA_TYPES = require('./constants/media').MEDIA_TYPES;
const MEDIA_PATHS = require('./constants/media').MEDIA_PATHS;
const DB = require('./database');

module.exports = {
  ENV: 'development',
  PORT: 4444,
  DB_HOST: DB.development.host,
  DB_PORT: DB.development.port,
  DB_NAME: DB.development.database,
  DB_USER: DB.development.username,
  DB_PASSWORD: DB.development.password,
  METHODS: {
    GET: 'get',
    POST: 'post',
    DELETE: 'delete',
    PATCH: 'patch',
  },
  LOCALISE_API_KEY: '',
  STATUSES,
  MAILJET_FROM_EMAIL: '',
  MAILJET_FROM_NAME: '',
  MAILJET_API_KEY: '',
  MAILJET_SECRET_KEY: '',
  AWS_SECRET_KEY: '',
  AWS_ACCESS_KEY: '',
  AWS_UPLOADS_BUCKET_NAME: '',
  AWS_S3_HOST: '',
  MEDIA_TYPES,
  MEDIA_PATHS,
};
