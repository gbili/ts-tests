import { get, mod } from 'shades';

// Exclude from T those types that are assignable to U
type RemoveIfAssignable<T, U> = T extends U ? never : T;

// From T, pick a set of properties whose keys are in the union K
type PickSomeTProps<T, K extends keyof T> = {
    [P in K]: T[P];
}

// Make all props of T readonly  
type AllPropsReadonly<T> = {
    readonly [P in keyof T]: T[P]; // P in keyof T, is a prop P found in T, and T[P] is the type of that prop
};
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
    RemoveIfAssignable<T, K> // remove T if assignable to K 
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
    mod: (f: (prop: RemoveIfAssignable<S[A], null | undefined>) => T[B]) => (obj: S) => T;
}

// or equivalently with our copy of Required

interface Lensi<S, T, A extends keyof S, B extends keyof T> {
    get: (obj: S) => S[A];
    mod: (f: (prop: RequiredKeys<S, A>) => T[B]) => (obj: S) => T;
}

// or with names
interface Getter<S, A extends keyof S> {
    (obj: S): S[A];
}
interface FromSAReturnTBCallback<S, T, A extends keyof S, B extends keyof T> {
    (prop: RequiredKeys<S, A>): T[B];
}
interface FromSReturnT<S, T> {
    (obj: S): T;
}
interface Modder<S, T, A extends keyof S, B extends keyof T> {
    (f: FromSAReturnTBCallback<S, T, A, B>): FromSReturnT<S, T>;
}
interface Lensin<S, T, A extends keyof S, B extends keyof T> {
    get: Getter<S, A>;
    mod: Modder<S, T, A, B>;
}

interface Foo {
    bar: number;
    baz?: string;
}

const bazLense: Lensin<Foo, Foo, "baz", "baz"> = {
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
const bazModifier = modifyUsingBazLense(x => x + 1); // [ts] Error - x is possibly 'undefined' 
const foo3 = bazModifier(foo)

foo3.baz; //


//medium.com/better-programming/type-yoga-typing-flexible-functions-with-typescripts-advanced-features-b5a282878b74
// Object that contains a prop named after the string passed as K
// can optionally have a type for the value V
export type HasKey<K extends string, V = any> = {
    [_ in K]: V;
}

type HasName = HasKey<"name", string>;

// get takes a string K and produces a function that accepts any object as parameter
// so long as that object has K as a key.
// that is the magic of HasKey; we can use it as part of an extends cluase to
// enforce that whatever we get handed has the key we want.
// Then the reuslt type is the type of the key K on S
type ForceKeyOnParamObjectAndReturnValue<K extends string> =
     <S extends HasKey<K>>(s: S) => S[K]

declare function get<K extends string>(k: K): ForceKeyOnParamObjectAndReturnValue<K>;

const user: HasName = {
  name: "John",
};
const name = get('name')(user);

