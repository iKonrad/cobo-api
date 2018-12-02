export default (field = 'value') => ({
  [field]: {
    presence: {
      message: 'error.fieldRequired',
    },
  },
});
