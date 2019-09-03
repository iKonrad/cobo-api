/* eslint-disable no-param-reassign,func-names */
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true } },
    password: { type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true } },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {},
  {
    dialect: 'mysql',
  });

  User.validPassword = (password, checkPassword, done, user) => {
    bcrypt.compare(password, checkPassword, (err, isMatch) => {
      if (err) console.log(err);
      if (isMatch) {
        return done(null, user);
      }
      return done(err, false);
    });
  };

  User.hook('beforeCreate', async user => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    if (hash) {
      user.password = hash;
    }
  });

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.associate = models => {
    User.hasMany(models.Media, { foreignKey: 'userId' });
  };

  return User;
};
