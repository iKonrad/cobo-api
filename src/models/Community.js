/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('Community', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    adultOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  Community.associate = models => {
    Community.hasMany(models.Membership, { foreignKey: 'communityId' });
    Community.hasMany(models.Post, { as: 'posts', foreignKey: 'communityId' });
  };

  return Community;
};
