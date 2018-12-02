export default {
  EmailConfirmation: (name, link) => ({
    TemplateID: 520382,
    Variables: {
      name,
      link,
    },
  }),
  GenericButton: (subject, name, body, button, url) => ({
    TemplateID: 520395,
    Variables: {
      subject,
      name,
      body,
      button,
      url,
    },
  }),
};
