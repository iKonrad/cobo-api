import models from 'models';
import validate from 'validate.js';

validate.validators.postMedia = async (mediaId, a, b, fields) => {
  if (fields.type !== 'image') {
    return;
  }

  if (!mediaId) {
    return 'error.mediaRequired';
  }

  const media = await models.Media.find({ where: { id: mediaId } });
  if (!media) {
    return 'error.mediaDoesNotExist';
  }
};

export default (isRequired) => ({
  mediaId: {
    presence: isRequired ? {
      message: 'error.mediaRequired',
    } : false,
    postMedia: true,
  },
});
