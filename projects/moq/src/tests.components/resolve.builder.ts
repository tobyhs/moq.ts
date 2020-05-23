// @ts-ignore
import SpyObj = jasmine.SpyObj;
// @ts-ignore
import Spy = jasmine.Spy;
import { Type } from "../lib/static.injector/type";
import { StaticProvider } from "../lib/static.injector/interface/provider";
import { Injector } from "../lib/static.injector/injector";
import { InjectionToken } from "../lib/static.injector/injection_token";

export type SpiedObject<T> = T & {
    [K in keyof T]: T[K] extends Function ? T[K] & SpiedObject<T> & Spy : SpiedObject<T[K]>;
};

let injector: Injector;

export function createInjector(providers: StaticProvider[]) {
    injector = Injector.create({providers});
    return injector;
}

export function resolve<T>(token: Type<T> | InjectionToken<T>): SpyObj<T> & Spy {
    return injector.get(token) as any;
}
