/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    used: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  Media.associate = models => {
    Media.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Media;
};
