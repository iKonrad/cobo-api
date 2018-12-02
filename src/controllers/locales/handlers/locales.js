import settings from 'settings';
import _ from 'lodash';

export default async ctx => {
  const locales = ctx.i18n.locales[ctx.i18n.locale];
  const enLocales = ctx.i18n.locales['en-GB'];

  const combinedLocales = _.defaults(locales, enLocales, {});

  ctx.body = {
    data: combinedLocales,
  };
};
