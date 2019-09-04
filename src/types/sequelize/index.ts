import * as Sequelize from 'sequelize';
import { UserAttributes, UserInstance } from 'models/User';
import { SessionAttributes, SessionInstance } from 'models/Session';

type SequelizeAttribute = string
    | Sequelize.DataTypeAbstract
    | Sequelize.DefineAttributeColumnOptions;

export type SequelizeAttributes<T extends { [key: string]: any }> = {
    [P in keyof T]: SequelizeAttribute
};

export interface DbInterface {
    sequelize: Sequelize.Sequelize;
    Sequelize: Sequelize.SequelizeStatic;
    User: Sequelize.Model<UserInstance, UserAttributes>;
    Session: Sequelize.Model<SessionInstance, SessionAttributes>;
}
