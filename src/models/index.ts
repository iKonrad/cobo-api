// src/models/index.ts
import Sequelize from 'sequelize';
import Settings from 'settings';
import { DbInterface } from 'types';
import { UserFactory } from './User';
import { SessionFactory } from './Session';

let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(Settings.DB_NAME, Settings.DB_USER, Settings.DB_PASSWORD, {
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
}

const models = {
  User: UserFactory(sequelize, Sequelize),
  Session: SessionFactory(sequelize, Sequelize),
};

const db: DbInterface = {
  sequelize,
  Sequelize,
  ...models,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(models);
  }
});

export default db;
