import { EqualMatcher } from "./equal.matcher";
import { EqualConstantMatcher } from "./equal-constant.matcher";
import { CommonTypeProvider } from "./common-type.provider";
import { TypesMatcher } from "./types.matcher";
import { PrimitiveMatcher } from "./primitive.matcher";
import { ObjectMatcher } from "./object.matcher";
import { FunctionMatcher } from "./function.matcher";
import { IterableTester } from "./iterable.tester";
import { IteratorMatcher } from "./iterator.matcher";
import { OBJECT_MATCHERS } from "./object-matchers.injection-token";
import { POJOMatcher } from "./pojo.matcher";
import { ObjectMapProvider } from "./object-map.provider";
import { MapMatcher } from "./map.matcher";
import { ConstantMatcher } from "../expression-matchers/constant.matcher";
import { Injector } from "../static.injector/injector";

/**
 * @hidden
 */
export const equalMatchersProviders = [
    {provide: CommonTypeProvider, useClass: CommonTypeProvider, deps: []},
    {provide: EqualConstantMatcher, useClass: EqualConstantMatcher, deps: [EqualMatcher]},
    {provide: ConstantMatcher, useExisting: EqualConstantMatcher},
    {
        provide: EqualMatcher, useClass: EqualMatcher, deps: [
            TypesMatcher,
            CommonTypeProvider,
            PrimitiveMatcher,
            ObjectMatcher,
            FunctionMatcher
        ]
    },
    {provide: FunctionMatcher, useClass: FunctionMatcher, deps: []},
    {provide: IterableTester, useClass: IterableTester, deps: []},
    {
        provide: IteratorMatcher, useClass: IteratorMatcher, deps: [
            Injector,
            IterableTester
        ]
    },
    {provide: ObjectMatcher, useClass: ObjectMatcher, deps: [OBJECT_MATCHERS]},
    {provide: POJOMatcher, useClass: POJOMatcher, deps: [MapMatcher, ObjectMapProvider]},
    {provide: PrimitiveMatcher, useClass: PrimitiveMatcher, deps: []},
    {provide: ObjectMapProvider, useClass: ObjectMapProvider, deps: []},
    {provide: TypesMatcher, useClass: TypesMatcher, deps: []},
    {provide: MapMatcher, useClass: MapMatcher, deps: [Injector]},
];
