import models from 'models';
import validate from 'validate.js';

validate.validators.isUsernameTaken = async username => {
  if (!username) {
    return 'error.fieldRequired';
  }
  if (username.length < 4) {
    return { id: 'error.tooShort', values: [4] };
  } else if (username.length > 30) {
    return { id: 'error.tooLong', values: [30] };
  }

  const user = await models.User.find({ where: { username } });
  if (user) {
    return 'error.usernameExists';
  }
};

export default (isRequired, checkAvailability = false) => ({
  username: {
    presence: isRequired ? {
      message: 'error.fieldRequired',
    } : false,
    isUsernameTaken: checkAvailability,
  },
});
