import settings from 'settings';
import Templates from './templates';

let Mailjet = require('node-mailjet');

Mailjet = Mailjet.connect(settings.MAILJET_API_KEY, settings.MAILJET_SECRET_KEY, {
  version: 'v3.1',
});

const send = async (email, template) => {
  if (email.indexOf('@test.com') >= 0) {
    return true;
  }

  const sendEmail = Mailjet.post('send');

  const emailData = {
    Messages: [{
      From: {
        Email: settings.MAILJET_FROM_EMAIL,
        Name: settings.MAILJET_FROM_NAME,
      },
      To: [{
        Email: email,
      }],
      TemplateLanguage: true,
      ...template,
    }],
  };

  try {
    await sendEmail.request(emailData);
  } catch (e) {
    return false;
  }
  return true;
};


export default {
  Templates,
  send,
};
