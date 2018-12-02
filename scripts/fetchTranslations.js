const axios = require('axios');
const dotize = require('dotize');
const fs = require('fs');
const settings = require('./../settings');

const fetchTranslations = () => {
  try {
    axios({
      method: 'get',
      url: 'https://localise.biz/api/export/all.json',
      headers: {
        Authorization: `Loco ${settings.LOCALISE_API_KEY}`,
      },
    }).then(({ data }) => {
      // Scan through all locales and build paths for every translation and store it in the json files
      const locales = Object.keys(data);
      for (const locale of locales) {
        let translations = data[locale];
        translations = dotize.convert(translations);
        fs.writeFileSync(`messages/${locale}.json`, JSON.stringify(translations, null, 2), 'utf-8');
        console.log('Done: ', locale, Object.keys(translations).length, 'translations');
      }
    });
  } catch (e) {
    console.log('Failed to fetch translations', e.message);
  }
};

fetchTranslations();
