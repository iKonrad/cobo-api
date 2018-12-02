/* eslint-disable no-console */
import 'babel-polyfill';
import http from 'http';
import Koa from 'koa';
import cors from '@koa/cors';
import koaJson from 'koa-json';
import bodyParser from 'koa-bodyparser';
import models from 'models';
import settings from 'settings';
import paths from 'settings/paths';
import controllers from 'controllers';
import Router from 'koa-router';
import locale from 'koa-locale';
import i18n from 'koa-i18n';
import errorMiddleware from 'server/middlewares/error';
import initModules from './init';


models.sequelize.sync().then(async () => {
  const app = new Koa();

  // Cors rule for production
  if (process.env.NODE_ENV === 'production') {
    app.use(cors({
      origin: 'https://szery.pl',
    }));
  }

  const router = new Router();

  locale(app);

  const lang = i18n(app, {
    directory: paths.messages,
    locales: ['en-GB', 'pl-PL'],
    defaultLocale: 'en-GB',
    modes: [
      'header', //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
    ],
    extension: '.json',
    parse: strings => JSON.parse(strings.toString()),
  });

  app.use(lang);

  app.keys = ['your-session-secret'];

  app.use(errorMiddleware);

  app.use(koaJson());

  // Body parser
  app.use(bodyParser());
  initModules(app);

  controllers.forEach(({ path, handler, method }) => {
    switch (method) {
      case settings.METHODS.GET: {
        router.get(path, handler);
        break;
      }
      case settings.METHODS.POST: {
        router.post(path, handler);
        break;
      }
      case settings.METHODS.DELETE: {
        router.del(path, handler);
        break;
      }
      case settings.METHODS.PATCH: {
        router.patch(path, handler);
        break;
      }
      default:
        break;
    }
  });


  app
    .use(router.routes())
    .use(router.allowedMethods());

  const protocol = http;
  protocol.createServer(app.callback()).listen(settings.PORT, () => {
    console.log('API listening on port', settings.PORT);
  });

  const user = await models.User.find({ where: { email: 'jarson@me.com' } });

  if (!user) {
    models.User.build({ email: 'jarson@me.com', password: 'test', username: 'konrad' }).save();
  }
});
