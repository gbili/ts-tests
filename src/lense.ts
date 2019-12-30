import { get, mod } from 'shades';

interface Getter<S, A extends keyof S> {
    (obj: S): S[A];
}

interface Lens<S, T, A extends keyof S, B extends keyof T> {
    get: (obj: S) => S[A];
    mod: (f: (prop: S[A]) => T[B]) => (obj: S) => T;
}

interface Foo {
    bar: number;
    baz?: string;
}

const baz: Lens<Foo, Foo, "baz", "baz"> = {
    get: function (foo) {
        return foo.baz;
    },
    mod: function (f) {
        return function (foo) {
            return {
                ...foo,
                baz: f(foo.baz),
            };
        };
    }
};

const bar: Lens<Foo, Foo, "bar", "bar"> = {
    get: foo => foo.bar,
    mod: f => foo => ({
        ...foo,
        bar: f(foo.bar),
    }),
};

const foo: Foo = {
    bar: 42,
};

// we can get, using our bar lense

get(bar)(foo); // 42

// (bar): specify the lense to use, what to get and what to apply the mod to
// (x => x + 1): use this modification function (will be the f in bar)
// (foo): modify this object

mod(bar)((x: number) => x + 1)(foo); // { bar: 43, }

// but this is all immutable so foo still is as before

foo.bar; // 42


get(baz)(foo); // 42