/* eslint-disable no-param-reassign,func-names */
import * as Sequelize from 'sequelize';
import bcrypt from 'bcrypt-nodejs';
import { DbInterface, SequelizeAttributes } from 'types';
import { SessionAttributes, SessionInstance } from './Session';

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;

  session?: SessionInstance | SessionAttributes['id'];
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
  getSessions: Sequelize.HasManyGetAssociationsMixin<SessionInstance>;
  setSessions: Sequelize.HasManySetAssociationsMixin<SessionInstance, SessionInstance['id']>;
  addSessions: Sequelize.HasManyAddAssociationsMixin<SessionInstance, SessionInstance['id']>;
  addSession: Sequelize.HasManyAddAssociationMixin<SessionInstance, SessionInstance['id']>;
  createSession: Sequelize.HasManyCreateAssociationMixin<SessionAttributes, SessionInstance>;
  removeSession: Sequelize.HasManyRemoveAssociationMixin<SessionInstance, SessionInstance['id']>;
  removeSessions: Sequelize.HasManyRemoveAssociationsMixin<SessionInstance, SessionInstance['id']>;
  hasSession: Sequelize.HasManyHasAssociationMixin<SessionInstance, SessionInstance['id']>;
  hasSessions: Sequelize.HasManyHasAssociationsMixin<SessionInstance, SessionInstance['id']>;
  countComments: Sequelize.HasManyCountAssociationsMixin;
}

export type DoneCallback = (err: Error|null, user: UserInstance|null) => void

export interface UserMethods {
  validPassword: (
      password: string,
      checkPassword: string,
      done: DoneCallback,
      user: UserInstance
  ) => void;
  prototype: {
    toJSON: () => string;
  };
}

export const UserFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
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
  };

  const User = sequelize.define<UserInstance, UserAttributes>('User', attributes) as unknown as Sequelize.Model<UserInstance, UserAttributes> & UserMethods;

  User.validPassword = (password, checkPassword, done, user): void => {
    bcrypt.compare(password, checkPassword, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      return done(err, null);
    });
  };

  User.hook('beforeCreate', async user => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    if (hash) {
      user.password = hash;
    }
  });

  User.prototype.toJSON = (): string => {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.associate = (models): void => {
    User.hasMany(models.Session, { foreignKey: 'userId' });
  };

  return User;
};
