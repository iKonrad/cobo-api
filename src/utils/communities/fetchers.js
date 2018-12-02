import models from 'models';
import elastic from 'utils/elasticsearch';
import e from 'http-errors';

export const subscribeCommunity = async (communityId, user) => {
  const community = await models.Community.findById(communityId);
  if (!community) {
    throw new e.BadRequest('errors.invalidCommunity');
  }

  let membership = await models.Membership.findOne({
    where: { userId: user.id, communityId },
    include: [{
      model: models.Community,
      as: 'community',
      attributes: ['id', 'name', 'slug'],
      required: true,
    }],
  });
  if (membership) {
    return membership;
  }

  membership = await models.Membership.create({
    communityId,
    userId: user.id,
    level: 4,
  });

  return models.Membership.findOne({
    where: { id: membership.id },
    include: [{
      model: models.Community,
      as: 'community',
      attributes: ['id', 'name', 'slug'],
      required: true,
    }],
  });
};

export const unsubscribeCommunity = async (communityId, user) => {
  const community = await models.Community.findById(communityId);
  if (!community) {
    throw new e.BadRequest('errors.invalidCommunity');
  }

  await models.Membership.destroy({ where: { userId: user.id, communityId } });
  return true;
};

export const getCommunity = async (idOrSlug, userId = null) => {
  const key = !isNaN(idOrSlug) ? 'id' : 'slug';
  return models.Community.find({ where: { [key]: idOrSlug } });
};

export const createCommunity = async (data, userId) => {
  // Create a new community instance and save it to the database
  let community = await models.Community.create(data);

  if (!community) {
    return null;
  }

  // Create new membership instance and save it to the database
  const membership = await models.Membership.create({
    communityId: community.id,
    userId,
    level: 10,
  });

  await community.addMembership(membership);
  await membership.setCommunity(community);

  community = await models.Community.findOne({ where: { id: community.id },
    include: [{ model: models.Membership }] });

  await elastic.saveCommunity(community.id, { ...data, userId });

  return community;
};
