/* eslint-disable no-param-reassign */

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
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

  Post.associate = models => {
    Post.hasMany(models.Comment, { foreignKey: 'postId' });
    Post.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
    Post.belongsTo(models.Community, { as: 'community', foreignKey: 'communityId' });
    Post.belongsTo(models.Media, { as: 'thumbnail', foreignKey: 'thumbnailId' });
    Post.belongsTo(models.Media, { as: 'media', foreignKey: 'mediaId' });
    Post.hasMany(models.Comment, { as: 'comments', foreignKey: 'postId' });
    Post.hasMany(models.Vote, { as: 'votes', foreignKey: 'postId' });
  };

  Post.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    if (values.thumbnail) {
      delete values.thumbnailId;
    }
    if (values.media) {
      delete values.mediaId;
    }
    return values;
  };

  return Post;
};
