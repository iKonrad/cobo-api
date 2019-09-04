import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'types';
import uuid from 'uuid/v4';
import { UserAttributes, UserInstance } from './User';

export interface SessionAttributes {
  id?: number;

  user?: UserInstance | UserAttributes['id'];
}

export interface SessionInstance extends Sequelize.Instance<SessionAttributes>, SessionAttributes {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstance>;
  setUser: Sequelize.BelongsToSetAssociationMixin<UserInstance, UserInstance['id']>;
  createUser: Sequelize.BelongsToCreateAssociationMixin<UserAttributes, UserInstance>;
}

export const SessionFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<SessionInstance, SessionAttributes> => {
  const attributes: SequelizeAttributes<SessionAttributes> = {
    id: { type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false,
      validate: { notEmpty: true } },
  };

  const Session = sequelize.define<SessionInstance, SessionAttributes>('Session', attributes);

  Session.hook('beforeCreate', async session => {
    // eslint-disable-next-line no-param-reassign
    session.id = uuid();
  });

  Session.associate = (models): void => {
    Session.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Session;
};
