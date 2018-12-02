import models from 'models';
import validate from 'validate.js';

validate.validators.isSlugCorrect = async slug => {
  if (!slug) {
    return 'error.fieldRequired';
  }

  if (typeof slug !== 'string') {
    return 'error.slugIncorrect';
  }

  if (slug.length < 4) {
    return { id: 'error.tooShort', values: [4] };
  }

  if (slug.length > 30) {
    return { id: 'error.tooLong', values: [30] };
  }

  const regex = new RegExp(/^[a-z][a-z-]*[a-z]$/);
  if (!regex.test(slug)) {
    return 'error.slugIncorrect';
  }

  const community = await models.Community.find({ where: { slug } });
  if (community) {
    return 'error.slugExists';
  }
};

export default () => ({
  slug: {
    isSlugCorrect: true,
  },
});
