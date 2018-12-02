import validate from 'validate.js';
import uuid from 'uuid/v4';

const validator = (min, max) => value => {
  if (!value) {
    return 'error.fieldRequired';
  }
  if (value.length < min) {
    return { id: 'error.tooShort', values: [min] };
  } else if (value.length > max) {
    return { id: 'error.tooLong', values: [max] };
  }
};

export default (name = 'value', min = 0, max) => {
  const id = uuid();
  validate.validators[id] = validator(min, max);

  return {
    [name]: {
      presence: {
        message: 'error.fieldRequired',
      },
      [id]: true,
    },
  };
};
