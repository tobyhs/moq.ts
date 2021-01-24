import { ISequenceVerifier } from "../moq";
import { Times } from "../times";
import { ExpressionReflector } from "../reflector/expression-reflector";
import { Tracker } from "../tracker/tracker";
import { ProxyFactory } from "../interceptors/proxy.factory";
import { Verifier } from "../verification/verifier";
import { Expressions } from "../reflector/expressions";
import { PrototypeStorage } from "../interceptors/prototype.storage";
import { createInjector2, resolve2, resolveMock } from "../../tests.components/resolve.builder";
import { MethodInteraction } from "../interactions";
import { MOCK_OPTIONS } from "../mock-options/mock-options.injection-token";
import { MOCK } from "../injector/mock.injection-token";
import { MockCore } from "./mock-core";
import { PresetBuilder } from "../presets/preset-builder";
import * as moq from "moq.ts";
import { SetupFactory } from "../presets/setup.factory";
import { StaticInjector } from "../static.injector/injector";
import { InjectionToken } from "../static.injector/injection_token";

describe("Mock core", () => {
    beforeEach(() => {
        createInjector2(MockCore, [
            MOCK_OPTIONS,
            Tracker,
            StaticInjector,
            ExpressionReflector,
            ProxyFactory,
            Verifier,
            PrototypeStorage,
            MOCK,
            SetupFactory
        ]);
    });

    beforeEach(() => {
        resolveMock(PrototypeStorage).prototypeof(PrototypeStorage.prototype);
        resolveMock(Verifier).prototypeof(Verifier.prototype);
        resolveMock(SetupFactory).prototypeof(SetupFactory.prototype);
    });

    it("Exposes mock name", () => {
        const name = "mock name";

        resolveMock(MOCK_OPTIONS)
            .setup(instance => instance.name)
            .returns(name);

        const core = resolve2(MockCore);
        const actual = core.name;

        expect(actual).toBe(name);
    });

    it("Exposes mock options", () => {
        const core = resolve2(MockCore);
        expect(core.options).toBe(resolve2(MOCK_OPTIONS));
    });

    it("Returns object", () => {
        const object = {};
        resolveMock(ProxyFactory)
            .setup(instance => instance.object())
            .returns(object);

        const core = resolve2(MockCore);
        const actual = core.object();

        expect(actual).toBe(object);
    });

    it("Returns resolved service", () => {
        const object = {};
        const token = new InjectionToken<any>("test");

        resolveMock(StaticInjector)
            .setup(instance => instance.get(token, null))
            .returns(object);

        const core = resolve2(MockCore);
        const actual = core.resolve(token);

        expect(actual).toBe(object);
    });

    it("Verifies an expression", () => {
        const expressions = [];
        const expression = instance => instance["property"];

        resolveMock(Tracker)
            .setup(instance => instance.get())
            .returns(expressions);

        const core = resolve2(MockCore);
        const actual = core.verify(expression, Times.Once());

        expect(actual).toBe(resolve2(MOCK));
        resolveMock(Verifier)
            .verify(instance => instance.test(expression, Times.Once(), expressions, undefined));
    });

    it("Verifies an expression has been invoked provided times", () => {
        const mockName = "name";
        const id = 1;
        const interaction = new MethodInteraction([]);
        const expressions = [
            {id, expression: interaction}
        ];
        resolveMock(Tracker)
            .setup(instance => instance.get())
            .returns(expressions);

        resolveMock(MOCK_OPTIONS)
            .setup(instance => instance.name)
            .returns(mockName);

        const core = resolve2(MockCore);
        const expression = instance => instance["property"];
        const actual = core.verify(expression, Times.AtLeastOnce());

        expect(actual).toBe(resolve2(MOCK));
        resolveMock(Verifier)
            .verify(instance => instance.test(expression, Times.AtLeastOnce(), [interaction], mockName));
    });

    it("Setups mock", () => {
        const builder = {} as PresetBuilder<unknown>;
        const expression = instance => instance["property"];
        const expectedExpression = {} as Expressions<unknown>;

        resolveMock(ExpressionReflector)
            .setup(instance => instance.reflect(expression))
            .returns([expectedExpression]);
        resolveMock(SetupFactory)
            .setup(instance => instance.create([expectedExpression]))
            .returns(builder);

        const core = resolve2(MockCore);
        const actual = core.setup(expression);

        expect(actual).toBe(builder);
    });

    it("Sets prototype of mock", () => {
        const prototype = {};

        const core = resolve2(MockCore);
        const actual = core.prototypeof(prototype);


        expect(actual).toBe(resolve2(MOCK));
        resolveMock(PrototypeStorage)
            .verify(instance => instance.set(prototype));
    });

    it("Adds verified expression into sequence verifier", () => {
        const sequenceVerifierMock = new moq.Mock<ISequenceVerifier>()
            .setup(instance => instance.add(moq.It.IsAny(), moq.It.IsAny))
            .returns(undefined);

        const expression = instance => instance["property"];

        const core = resolve2(MockCore);
        const actual = core.insequence(sequenceVerifierMock.object(), expression);

        expect(actual).toBe(resolve2(MOCK));
        sequenceVerifierMock.verify(instance => instance.add(core, expression));
    });
});
