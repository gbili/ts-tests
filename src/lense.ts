import { get, mod } from 'shades';

interface Getter<S, A extends keyof S> {
    (obj: S): S[A];
}

// Exclude from T those types that are assignable to U
type RemoveTIfExtends<T, U> = T extends U ? never : T;

// From T, pick a set of properties whose keys are in the union K
type PickSomeTProps<T, K extends keyof T> = {
    [P in K]: T[P];
}

// Make all props of T Optional 
type AllPropsOptional<T> = {
    [P in keyof T]?: T[P]; // P in keyof T, is a prop P found in T, and T[P] is the type of that prop
};

type NotNullAndNotUndefined<T> = T extends null | undefined ? never : T;

// Make all props of T required (same as optional but with a minus -?)
type AllPropsRequired<T> = {
    [P in keyof T]-?: T[P];
};
type RequiredKeys<T, K extends keyof T> = 
    RemoveTIfExtends<T, K> // remove T if assignable to K 
    & AllPropsRequired<
        PickSomeTProps<T, K>
    >;

interface Lens<S, T, A extends keyof S, B extends keyof T> {
    get: (obj: S) => S[A];
    mod: (f: (prop: NonNullable<S[A]>) => T[B]) => (obj: S) => T;
}

// or equivalently with our copy of NonNullable

interface Lenso<S, T, A extends keyof S, B extends keyof T> {
    get: (obj: S) => S[A];
    mod: (f: (prop: NotNullAndNotUndefined<S[A]>) => T[B]) => (obj: S) => T;
}

// or equivalently with our copy of Required

interface Lensi<S, T, A extends keyof S, B extends keyof T> {
    get: (obj: S) => S[A];
    mod: (f: (prop: RequiredKeys<S, A>) => T[B]) => (obj: S) => T;
}

interface Foo {
    bar: number;
    baz?: string;
}

const bazLense: Lens<Foo, Foo, "baz", "baz"> = {
    get: function (foo: Foo) {
        return foo.baz;
    },
    mod: function (f) {
        return function (foo: Foo) {
            return {
                ...foo,
                baz: f(foo.baz), // problem here, we can pass undefined 
            };
        };
    }
};

const bazLensi: Lensi<Foo, Foo, "baz", "baz"> = {
    get: function (foo: Foo) {
        return foo.baz;
    },
    mod: function (f) {
        return function (foo: Foo) {
            return {
                ...foo,
                baz: f(foo.baz), // problem here, we can pass undefined 
            };
        };
    }
};

const bazLenso: Lenso<Foo, Foo, "baz", "baz"> = {
    get: function (foo: Foo) {
        return foo.baz;
    },
    mod: function (f) {
        return function (foo: Foo) {
            return {
                ...foo,
                baz: f(foo.baz), // problem here, we can pass undefined 
            };
        };
    }
};

const barLense: Lens<Foo, Foo, "bar", "bar"> = {
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

get(barLense)(foo); // 42

// (barLense): specify the lense to use, what to get and what to apply the mod to
// (x => x + 1): use this modification function (will be the f in bar)
// (foo): modify this object

mod(barLense)((x: number) => x + 1)(foo); // { bar: 43, }

// but this is all immutable so foo still is as before

foo.bar; // 42

const modifyUsingBarLense = mod(barLense);
const barModifier = modifyUsingBarLense(x => x + 1);
const foo2 = barModifier(foo)

foo2.bar; // 42

const modifyUsingBazLense = mod(bazLense);
const bazModifier = modifyUsingBazLense(x => x + 1);
const foo3 = bazModifier(foo)

foo3.baz; // 