/* eslint-disable no-console */
// Modules
import Sequelize from 'sequelize';
import Settings from 'settings';
import paths from 'settings/paths';

const fs = require('fs');
const path = require('path');

const basename = 'index.js';
const db = {};
let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(Settings.DB_NAME, Settings.DB_USER, Settings.DB_PASSWORD, {
    // logging: query => { console.log(`[DATABASE]: ${query}`); },
    logging: false,
    host: Settings.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false,
  });

  fs
    .readdirSync(paths.models)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
      const model = sequelize.import(path.join(paths.models, file));
      db[model.name] = model;
    });

  Object.keys(db)
    .forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
