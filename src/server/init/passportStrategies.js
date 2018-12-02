import passport from 'koa-passport';
import JsonStrategy from 'passport-json';
import BearerStrategy from 'passport-http-bearer';
import models from 'models';

const SESSION_DAYS = 5;

export default app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    try {
      done(null, user.id);
    } catch (e) {
      done(e);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await models.User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const membershipsInclude = {
    model: models.Membership,
    as: 'memberships',
    required: false,
    attributes: ['id', 'createdAt', 'level'],
    include: [{
      model: models.Community,
      as: 'community',
      attributes: ['id', 'name', 'slug'],
      required: true,
    }],
  };

  passport.use(new JsonStrategy(
    ((username, password, done) => {
      models.User.find({
        where: { username },
        include: [
          membershipsInclude,
        ],
      }).then(user => {
        const passwd = user ? user.password : '';
        models.User.validPassword(password, passwd, done, user);
      });
    }),
  ), null);

  passport.use(new BearerStrategy(
    ((token, done) => {
      models.Session.find({ where: { id: token } }).then(session => {
        if (session) {
          const today = new Date();
          const difference = session.createdAt - today;
          if (difference > SESSION_DAYS * 60 * 60 * 24) {
            session.destroy().then(() => {
              done(new Error('Session expired'), false);
            });
          }
          models.User.find({ where: { id: session.userId },
            include: [
              membershipsInclude,
            ] }).then(user => {
            if (user) {
              done(null, user);
            } else {
              done(new Error('No user found for this session'), false);
            }
          }).catch(err => done(err, false));
        } else {
          done(new Error('No session found', false));
        }
      }).catch(err => {
        done(err, false);
      });
    }),
  ), null);
};
