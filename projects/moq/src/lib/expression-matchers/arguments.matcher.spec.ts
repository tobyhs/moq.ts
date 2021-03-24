import { ArgumentsMatcher } from "./arguments.matcher";
import { ConstantMatcher } from "./constant.matcher";
import { createInjector2, resolve2, resolveMock } from "../../tests.components/resolve.builder";
import { It } from "moq.ts";

describe("Arguments matcher", () => {
    beforeEach(() => {
        createInjector2(ArgumentsMatcher, [ConstantMatcher]);
    });

    it("Returns true when both are undefined", () => {
        const left = undefined;
        const right = undefined;

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched(left, right);

        expect(actual).toBe(true);
    });

    it("Returns true when both are null", () => {
        const left = null;
        const right = null;

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched(left, right);

        expect(actual).toBe(true);
    });

    it("Returns true when both are same object", () => {
        const value = [];

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched(value, value);

        expect(actual).toBe(true);
    });

    it("Returns true when constant matcher returns true for every each item", () => {
        const left = "left value";
        const right = "right value";

        resolveMock(ConstantMatcher)
            .setup(instance => instance.matched(left, right))
            .returns(true);

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched([left], [right]);

        expect(actual).toBe(true);
    });


    it("Returns false when left and right have different length", () => {
        const left = [];
        const right = [1];

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched(left, right);

        expect(actual).toBe(false);
    });


    it("Returns false when constant matcher returns false for any item", () => {
        const value = "same value";
        const left = "left value";
        const right = "right value";

        resolveMock(ConstantMatcher)
            .setup(instance => instance.matched(It.IsAny(), It.IsAny()))
            .returns(false);

        const matcher = resolve2(ArgumentsMatcher);
        const actual = matcher.matched([value, left], [value, right]);

        expect(actual).toBe(false);
    });
});
