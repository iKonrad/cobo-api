import axios from 'axios';
import dotize from 'dotize';
import fs from 'fs';
import settings from 'settings';
import paths from 'settings/paths';

export const fetchTranslations = async () => {
  try {
    const { data } = await axios({
      method: 'get',
      url: 'https://localise.biz/api/export/all.json',
      headers: {
        Authorization: `Loco ${settings.LOCALISE_API_KEY}`,
      },
    });

    // Scan through all locales and build paths for every translation and store it in the json files
    const locales = Object.keys(data);
    for (const locale of locales) {
      let translations = data[locale];
      translations = dotize.convert(translations);
      fs.writeFileSync(`${paths.messages}/${locale}.json`, JSON.stringify(translations, null, 2), 'utf-8');
    }
  } catch (e) {
    console.log('Failed to fetch translations', e.message);
  }
};

export const createAsset = async id => {
  if (settings.ENV !== 'production') {
    try {
      await axios({
        method: 'post',
        url: 'https://localise.biz/api/assets',
        headers: {
          Accept: 'application/json',
          Authorization: `Loco ${settings.LOCALISE_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: `id=${id}`,
      });
    } catch (e) {}
  } else {
    console.log('[LOCALISATION] Missing translation for key: ', id);
  }
};
