/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    upvote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  Vote.associate = models => {
    Vote.belongsTo(models.Post, { as: 'post', foreignKey: 'postId' });
    Vote.belongsTo(models.Comment, { as: 'comment', foreignKey: 'commentId' });
    Vote.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Vote;
};
