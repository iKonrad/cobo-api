export default (field = 'value', allowLocal = false) => ({
  [field]: {
    url: {
      allowLocal,
      message: 'error.urlNotValid',
    },
  },
});
