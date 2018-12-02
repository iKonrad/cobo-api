import models from 'models';
import validate from 'validate.js';

validate.validators.doesMediaExists = async thumbnailId => {
  if (!thumbnailId) {
    return null;
  }

  const media = await models.Media.find({ where: { id: thumbnailId } });
  if (!media) {
    return 'error.mediaDoesNotExist';
  }
};

export default (name, isRequired) => ({
  [name]: {
    presence: isRequired ? {
      message: 'error.mediaRequired',
    } : false,
    doesMediaExists: true,
  },
});
