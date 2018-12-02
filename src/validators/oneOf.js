export default (field = 'name', values) => ({
  [field]: {
    inclusion: {
      within: values,
      message: { id: 'error.value.notMatch', values: values.join(' ') },
    },
    presence: {
      message: 'error.fieldRequired',
    },
  },
});
