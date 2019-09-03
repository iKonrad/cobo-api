import { Middleware } from 'koa';

export enum Method {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    PATCH = 'patch',
}

export interface ControllerType {
    path: string;
    method: Method;
    handler: Middleware;
}
