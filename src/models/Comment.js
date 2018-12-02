/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  Comment.associate = models => {
    Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    Comment.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
    Comment.belongsTo(models.Comment, { as: 'parent', foreignKey: 'parentId' });
    Comment.hasMany(models.Comment, { as: 'children', foreignKey: 'parentId' });
    Comment.hasMany(models.Vote, { as: 'votes', foreignKey: 'commentId' });
  };

  Comment.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    if (values.deleted) {
      values.text = '';
    }
    return values;
  };

  return Comment;
};
