/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  Membership.associate = models => {
    Membership.belongsTo(models.User, { foreignKey: 'userId' });
    Membership.belongsTo(models.Community, { foreignKey: 'communityId', as: 'community' });
  };

  return Membership;
};
