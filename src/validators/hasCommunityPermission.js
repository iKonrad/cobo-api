import validate from 'validate.js';
import models from 'models';


export default (level = 10) => {
  validate.validators.hasCommunityPermission = async (id, options, key, attrs, global) => {
    const community = await models.Community.findOne({ where: { id } }, {
      include: [{ model: models.Membership }],
    });

    if (!community) {
      return 'error.community.notExist';
    }
  };

  return {
    id: {
      presence: {
        message: 'error.fieldRequired',
      },
      hasCommunityPermission: true,
    },
  };
};
