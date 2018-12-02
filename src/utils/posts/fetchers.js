/* eslint-disable no-param-reassign */
import sequelize from 'sequelize';
import elastic from 'utils/elasticsearch';
import models from 'models';
import Communities from 'utils/communities';
import e from 'http-errors';

export const searchPosts = async (user, communityIds) => {
  const data = await elastic.popularPosts(communityIds);
  const postIds = data.map(item => item._source.id);

  const includes = [
    {
      model: models.Comment,
      as: 'comments',
      attributes: ['id', 'text', 'score'],
    },
    {
      model: models.User,
      as: 'author',
      attributes: ['id', 'username'],
    },
    {
      model: models.Media,
      as: 'thumbnail',
      required: false,
    },
    {
      model: models.Media,
      as: 'media',
      required: false,
    },
    {
      model: models.Community,
      as: 'community',
      required: true,
      attributes: ['slug'],
    },
  ];

  if (user && user.id) {
    includes.push({
      model: models.Vote,
      as: 'votes',
      where: { userId: user.id },
      required: false,
    });
  }


  let posts = [];
  if (postIds && postIds.length > 0) {
    posts = await models.Post.findAll(
      {
        where: { id: [postIds] },
        order: [
          [sequelize.fn('FIELD', sequelize.col('Post.id'), postIds)],
        ],
        include: includes,
      },
    );
  }


  return posts;
};

export const fetchPost = async (id, userId = null) => {
  const commentAuthorInclude = () => {
    const obj = [
      {
        model: models.User,
        as: 'author',
        attributes: ['id', 'username'],
      },
    ];

    if (userId) {
      obj.push({
        model: models.Vote,
        as: 'votes',
        where: { userId },
        required: false,
        attributes: ['upvote'],
      });
    }

    return obj;
  };

  return models.Post.findOne({
    where: { id },
    include: [
      {
        model: models.Vote,
        as: 'votes',
        where: { userId },
        required: false,
      },
      {
        model: models.Media,
        as: 'thumbnail',
      },
      {
        model: models.Media,
        as: 'media',
      },
      {
        model: models.User,
        as: 'author',
        attributes: ['id', 'username'],
      },
      {
        model: models.Comment,
        as: 'comments',
        required: false,
        where: { parentId: null },
        include: [
          {
            model: models.Comment,
            as: 'children',
            include: [
              {
                model: models.Comment,
                as: 'children',
                include: [
                  {
                    model: models.Comment,
                    as: 'children',
                    include: [
                      {
                        model: models.Comment,
                        as: 'children',
                        include: [
                          ...commentAuthorInclude(),
                        ],
                      },
                      ...commentAuthorInclude(),
                    ],
                  },
                  ...commentAuthorInclude(),
                ],
              },
              ...commentAuthorInclude(),
            ],
          },
          ...commentAuthorInclude(),
        ],
      },
    ],
  });
};

export const createPost = async payload => {
  // Check if community exists first
  const community = await Communities.Fetchers.getCommunity(payload.communityId);

  if (!community) {
    throw new e.BadRequest('errors.invalidCommunity');
  } else {
    payload.communityId = community.id;
    const post = await models.Post.create(payload);
    if (post) {
      if (payload.thumbnailId) {
        const thumbnail = await models.Media.findOne({ where: { id: payload.thumbnailId } });
        thumbnail.used = true;
        await thumbnail.save();
      }
      if (payload.mediaId) {
        const media = await models.Media.findOne({ where: { id: payload.mediaId } });
        media.used = true;
        await media.save();
      }
    }
    await elastic.savePost(post.id, post.toJSON());
    return fetchPost(post.id);
  }
};

/**
 * Handles the logic of voting on a post:
 * Updates database, updates elastic search
 * @param postId
 * @param userId
 * @param upvote
 * @returns {Promise<Model>}
 */
export const votePost = async (postId, userId, upvote = true) => {
  const post = await models.Post.findOne({ where: { id: postId } });
  if (!post) {
    throw new e.BadRequest('errors.invalidPost');
  }

  const vote = await models.Vote.findOne({
    where: {
      postId,
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
      postId,
    });
  }

  await models.Post.update({
    score: sequelize.literal(`score + ${scoreIncrement}`),
    totalVotes: sequelize.literal(`totalVotes + ${totalIncrement}`),
  },
  { where: { id: postId } });
  post.score += scoreIncrement;
  post.totalVotes += totalIncrement;

  // Update votes count in elastic search
  await elastic.votePost(post.id, post.totalVotes, post.score);

  return post;
};
