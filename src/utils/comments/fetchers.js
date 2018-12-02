/* eslint-disable no-param-reassign */
import sequelize from 'sequelize';
import models from 'models';
import elastic from 'utils/elasticsearch';
import Posts from 'utils/posts';
import e from 'http-errors';

export const createComment = async (authorId, postId, parentId, text) => {
  const post = await Posts.Fetchers.fetchPost(postId);
  if (!post) {
    throw new e.BadRequest('errors.invalidPost');
  }

  if (parentId) {
    const parent = await models.Comment.findOne({ where: { id: parentId } });
    // eslint-disable-next-line eqeqeq
    if (!parent || postId != parent.postId) {
      throw new e.BadRequest('errors.invalidParentComment');
    }
  }

  const createdComment = await models.Comment.create({
    authorId,
    postId,
    parentId,
    text,
    score: 0,
  });

  const comment = await models.Comment.findOne({
    where: { id: createdComment.id },
    include: [
      {
        model: models.User,
        as: 'author',
        attributes: ['id', 'username'],
      },
    ],
  });

  await elastic.incrementPostCommentsCount(postId);

  return comment;
};

export const voteComment = async (commentId, userId, upvote = true) => {
  const comment = await models.Comment.findOne({ where: { id: commentId } });
  if (!comment) {
    throw new e.BadRequest('errors.invalidComment');
  }

  const vote = await models.Vote.findOne({
    where: {
      commentId,
      userId,
    },
  });

  let scoreIncrement = upvote ? 1 : -1;
  let totalIncrement = 1;


  // If user has already voted do either one of these two things:
  // If the vote is the same as the previous one, remove it
  // If the vote is opposite (for example, first user upvoted then downvoted, change it to the
  // latter)
  if (vote) {
    if (vote.upvote !== upvote) {
      totalIncrement = 0;
      vote.upvote = upvote;
      scoreIncrement = upvote ? 2 : -2;
      await vote.save();
    } else {
      totalIncrement = -1;
      await vote.destroy();
      scoreIncrement = !upvote ? 1 : -1;
    }
  } else {
    await models.Vote.create({
      upvote,
      userId,
      commentId,
    });
  }

  await models.Comment.update({
    score: sequelize.literal(`score + ${scoreIncrement}`),
    totalVotes: sequelize.literal(`totalVotes + ${totalIncrement}`),
  },
  { where: { id: commentId } });
  comment.score += scoreIncrement;
  comment.totalVotes = totalIncrement;
  return comment;
};

export const editComment = async (commentId, userId, text) => {
  const comment = await models.Comment.findOne({
    where: { id: commentId },
    include: [
      {
        model: models.User,
        as: 'author',
        attributes: ['id', 'username'],
      },
    ],
  });

  if (!comment) {
    throw new e.BadRequest('errors.invalidComment');
  }

  if (comment.authorId !== userId) {
    throw new e.NotAuthorized('errors.notAuthorized');
  }

  comment.text = text;
  await comment.save();

  return comment;
};

export const deleteComment = async (commentId, userId) => {
  const comment = await models.Comment.findOne({
    where: { id: commentId },
    include: [
      {
        model: models.User,
        as: 'author',
        attributes: ['id', 'username'],
      },
    ],
  });

  if (!comment) {
    throw new e.BadRequest('errors.invalidComment');
  }

  if (comment.authorId !== userId) {
    throw new e.NotAuthorized('errors.notAuthorized');
  }

  comment.deleted = true;
  await comment.save();

  return true;
};
