import models from 'models';
import validate from 'validate.js';

validate.validators.isEmailTaken = async email => {
  const user = await models.User.find({ where: { email } });
  if (user) {
    return 'error.emailExists';
  }
};

export default (isRequired, checkAvailability = false) => ({
  email: {
    presence: isRequired ? {
      message: 'error.fieldRequired',
    } : false,
    email: {
      message: 'error.invalidEmail',
    },
    isEmailTaken: checkAvailability,
  },
});
