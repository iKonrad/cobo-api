/* eslint-disable no-param-reassign */
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: { type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false,
      validate: { notEmpty: true } },
  },
  {},
  {
    dialect: 'mysql',
  });


  Session.hook('beforeCreate', async session => {
    session.id = uuid();
  });

  Session.associate = models => {
    Session.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Session;
};
