export default (isRequired = true) => ({
  password: {
    presence: isRequired ? {
      message: 'error.fieldRequired',
    } : false,
    format: {
      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      message: 'error.passwordFormatInvalid',
    },
  },
});
