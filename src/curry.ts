import R from 'ramda';

// https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/

// fixed amount of arguments to 3
const curry2 = function (f: (...args: any[]) => any): (arg: any) => any {
    // get the list of arguments passed at call time to 
    return function (a) {
        return function (b) {
            return function (c) {
                return f(a, b, c);
            }
        }
    }
}

// BAD because curryedArgs can increase to infinity if infinite calls with the last argument
const curry1 = function <T>(f: (...args: any[]) => T): (arg: any) => any {
    // get the list of arguments passed at call time to 
    return function curryfy(arg: any): (arg: any) =>  {
        if (arguments.length >= f.length) {
            return f.apply(null, Array.from(arguments));
        } else {
            return curryfy.bind(null, ...Array.from(arguments));
        }
    }
}

const curry0 = function (f) {
    for (let i=0; i < f.length; i++) {
        let fu = function(a) {
        }
    }
}

const addCurried = curry(function (x: string, y: string, z: string): string {
    return x + y + z;
});

const xyz: string = addCurried('x')('y')('z');
const addToX = addCurried('x');
const addToXY = addToX('y');
const xyz2 = addToXY('z');

const fn00 = (a: string, b: number[], c: boolean): boolean => b.length > 1 && c; 

// Get the parameters types as a tuple of types
type Params<F extends (...args: any[]) => any> =
    F extends ((...args: infer A) => any)
    ? A
    : never;

// test
type fn00P = Params<typeof fn00>; // param types array (aka tuple)

// Get the return type of a function
type Ret<F extends (...args: any[]) => any> =
    F extends((...args: any[]) => infer R)
    ? R
    : never;
// test
type fn00R = Ret<typeof fn00>; // return type

// Get the first element type of an array
type Head<T extends any[]> =
    T extends [any, ...any[]]
    ? T[0]
    : never;

// test
type fn00P1 = Head<Params<typeof fn00>> // first param type (aka tuple)

// Get the 
// Note: a classic curried function consumes arguments one by one.
// This means that when we consumed <Head<Params<F>>>, we somehow
// need to move on to the next param that has not yet been consumed
// This is why we need Tail: removes the first entry of a tuple
// as of TS 3.4 we cannot remove the 1st emntry of a tuple we we
// need a wrokaround
type Tail<T extends any[]> =
    ((...t: T) => any) extends ((_: any, ...tail: infer TT) => any)
    ? TT
    : [];

// test
type fn00PN_1 = Tail<Params<typeof fn00>> // param types array (aka tuple) minus first param

type GenericFunction = (...args: any[]) => any;
type SingleElementArray = [any];

type EmptyArray = [];

type IsEmpty<T extends any[]> =
    T extends EmptyArray
    ? true
    : false;

type HasLessThanTwoEls<T extends any[]> =
    T extends (SingleElementArray | EmptyArray)
    ? true
    : false;

type Invert<B extends boolean> =
    B extends true
    ? false
    : true;

// We need to know when the curried function's arguments have been filled
// and will therefor return the actual initial function return type
type HasTail<T extends any[]> = Invert<HasLessThanTwoEls<T>>;

// test
type fn00PHasTail1 = HasTail<Params<typeof fn00>> // true
type fn00PHasTail2 = HasTail<Tail<Params<typeof fn00>>> // true
type fn00PHasTail3 = HasTail<Tail<Tail<Params<typeof fn00>>>> // false

// Get the type of a prop with name S in object of type O
type GetPropType<S extends keyof O, O> =
    O extends { [P in S]: infer A }
    ? A
    : never;

// test
const obj = { it: 3, is: "a", a: () => true };
type aPropType = GetPropType<"a", typeof obj>; // () => boolean

// Get inner types from function types
type FunctionARInfer<F> =
    F extends (...args: infer A) => infer R
    ? { args: A, ret: R } 
    : never;

// test
const fn = (a: number, b: string): number => a;
type funcTypes = FunctionARInfer<typeof fn>;
type funcArgTypes = funcTypes["args"]; // [number, string]
type funcRetType = funcTypes["ret"]; // number

// Get the ?
type ClassInfer<C> =
    C extends Promise<infer G>
    ? G
    : never;

// test
const prom = new Promise<string>(() => "");
type prom00 = ClassInfer<typeof prom>; // string

// Get a union U of all types in array
type ArrayInfer<A> =
    A extends (infer U)[]
    ? U
    : never;

// test
const arr = [1, "", "a", 2];
type arr00 = ArrayInfer<typeof arr>; // string | number

// Get type of tuple first element as A and the rest as a union in U
type TupleInfer<T> =
    T extends [infer A, ...(infer U)[]]
    ? [A, U]
    : never;

// test
type tup00 = TupleInfer<[string, boolean, number]>; // [string, boolean | number] 

// Conditional Accessor: allows accessing the branch depending on the test return.
// the conditional accessor part is the test between the square brackets in
// Everytime the CondAccessEx<B> is called, the test is performed and a branch is chosen
type CondAccessEx<B> = {
    0: string;
    1: number; // evaluates to this branch if B extends 'a'
    2: "";
    3: any;
}[ // Conditional Accessor test: whatever is returned here will determine the branch taken above
    B extends true
    ? 0
    : B extends 'a'
      ? 1
      : B extends []
        ? 2
        : 3
];
// test
type cond00 = CondAccessEx<'a'>; // number

// Recursive Types
// Last : takes a tuple as parameter an extracts its last entry out
type Last<T extends any[]> = {
    0: Last<Tail<T>> // if there are two entries or more, then RECURSE using the Tail (aka all entries minus first)
    1: Head<T> // else T has a single or no elements, then return the head (aka the first element)
}[
    HasTail<T> extends true  // test whether there are two entries or more
    ? 0
    : 1
]
// test
type test29 = Last<[1, 2, 3, 'last']> // 'last' -> got it using Last<Tail<[3, 'last']>> aka Last<['last']> and then since no more tail: Head<['last']>
type test30 = Last<[3]> // 3 -> got it using directly Head<[3]>

// Get the length of an array as a type
type Length<T extends any[]> = T["length"];
// test
type ln00 = Length<[any, number, ""]>; // 3 where 3 is a type, (and [any, number, ""] aswell)

// Add type E at the top of a tuple T
// Going through functions to use rest parameters feature
// placing E at the beggining of function type on the left
// as first parameter.
// Then we test whether our created function type with all
// the parameters defined on the left, do extend the one on the right
// We use infer to capture all the arguments on the left even our
// newly prepended head: E
type Prepend<E, T extends any[]> =
    ((head: E, ...args: T) => any) extends ((...args: infer U) => any)
    ? U
    : T;
// test
type prep00 = Prepend<boolean, [number, string, number]>; // [boolean, number, string, number]
type prep00Length = Length<prep00>; // 4, where 4 is a type
type prep01 = Prepend<boolean, []>; // [boolean]

// Drop the first N entries of a T tuple
// We are using a cool trick here. Since we are not
// allowed to increment numbers, we use an array to which
// we are allowed to add elements using Prepend, and
// it serves as a counter
type Drop<N extends number, T extends any[], I extends any[] = []> = {
    0: T;
    1: Drop<N, Tail<T>, Prepend<any, I>>;
}[
    N extends Length<I>
    ? 0
    : 1
]
// test
type drop00 = Drop<2, [string, number, boolean]>; // [boolean]

// Cast
// Sometimes we know that a certain var of type X
// is actually a type Y. But TS does not know it,
// so we create a type transformation when the type
// of X is less generic than Y we use X otherwise we use Y 
type Cast<X, Y> = X extends Y ? X : Y;
// test
type cast00 = Cast<[string], any>; // [string]
type cast01 = Cast<[string], number>; // number 

// Position: use it to query the position of an iterator
type Pos<I extends any[]> = Length<I>;
// test
type p00 = Pos<[any, any]>;

// Next (+1): brings the position of an iterator up:
type Next<I extends any[]> = Prepend<any, I>;
// Prev (-1): brings the position of an iterator up:
type Prev<I extends any[]> = Tail<I>;

// Iterator: creates an iterator (our counter type) at
// a position defined by Index and is able to start off
// from another iterator's position by using From
type MyIterator<Index extends number = 0, From extends any[] = [], I extends any[] = []> = {
    0: MyIterator<Index, Next<From>, Next<I>>
    1: From
}[
    Pos<I> extends Index
    ? 1
    : 0
]
// test
type test53 = MyIterator<2>; // [any, any]
type test54 = MyIterator<2, test53>; // [any, any, any, any]
type test55 = Pos<test54>; // 4
type test56 = Prev<test54>; // [any, any, any]
type test57 = Pos<test56>; // 3
type test58 = Next<test56>; // [any, any, any, any]
type test59 = Pos<test58>; // 4

// Reverse: takes a tuple T and turns it the other way around into a tuple R
type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
    0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;
    1: R;
}[
    Pos<I> extends Length<T>
    ? 1
    : 0
];
// test
type test67 = Reverse<[1, 2, 3]>; // [3, 2, 1]
type test68 = Reverse<test67>; // [1, 2, 3]
type test69 = Reverse<[2, 1], [3, 4]>; // [1, 2, 3, 4] // Reverse first param and prepend it to second one

// Concat
type Concat<T1 extends any[], T2 extends any[]> =
    Reverse<Cast<Reverse<T1>, any[]>, T2>;
// test
type test70 = Concat<[2, 1], [3, 4]>; // [2, 1, 3, 4] // Reverse first param and prepend it to second one

// Append
type Append<E, T extends any[]> = Concat<T, [E]>;
// test
type app0 = Append<number, [1, 2, 3, 4]>;

// this is going to be our gap type
type __ = typeof R.__;

// GapOf : checks for a placeholder in a tuple T1 at the position described by the iterator I
// if it is found, the matching type is collected at the same position in T2 and carried over
// (saved) for the next step through TN
type GapOf<T1 extends any[], T2 extends any[], TN extends any[], I extends any[]> =
    T1[Pos<I>] extends __
        ? Append<T2[Pos<I>], TN>
        : TN;
// tests
type test62 = GapOf<[__, __], [number, string], [], MyIterator<0>> // [number]
type test63 = GapOf<[__, __], [number, string], [], MyIterator<1>> // [string]

// GapsOf: Returns the list in T2 that are a __ in T1 or after the positions refrenced in T1
type GapsOf<T1 extends any[], T2 extends any[], TN extends any[] = [], I extends any[] = []> = {
    0: GapsOf<T1, T2, Cast<GapOf<T1, T2, TN, I>, any[]>, Next<I>>;
    1: Concat<TN, Cast<Drop<Pos<I>, T2>, any[]>>;
}[
    Pos<I> extends Length<T1>
    ? 1
    : 0
];
// tests
type test64 = GapsOf<[__, any, __], [number, string, object, string[]]>; // [number, object, string[]]

// Gaps: using mapped types, we alter the proerties of T
// such that they can either be of their own type or the gap: __ type
type PartialGaps<T extends any[]> = {
    [K in keyof T]?: T[K] | __
}

type CleanedGaps<T extends any[]> = {
    [K in keyof T]: NonNullable<T[K]>
}

type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>>;
// tests
type test71 = Gaps<[number, string]>; // [(number | __)?, (string | __)?]


type CurryV0<P extends any[], R> =
    // A "classic curry" takes only a single argument at a time
    (arg0: Head<P>) => HasTail<P> extends true
        // if we did not reachend of the parameters, recurse
        ? CurryV0<Tail<P>, R> 
        // else, infer the return type of the curried function
        : R;

declare function curryV0<P extends any[], R>(fn: (...args: P) => R): CurryV0<P, R>;
const toCurry02 = (name: string, arge: number, single: boolean) => true;
const curried02 = curryV0(toCurry02); // CurryV0<[string, number, boolean], boolean>
const test23    = curried02('Jane')(23)(true); // boolean -> GOOD
const curried021 = curryV0(toCurry02); // CurryV0<[string, number, boolean], boolean>
const curried021Partial1 = curried021('Jane'); // CurryV0<[number, boolean], boolean>
const curried021Partial2 = curried021Partial1(23); // CurryV0<[boolean], boolean>
const curried021Full = curried021Partial2(true); // CurryV0<boolean>
const curried021FullWrongParamType = curried021Partial2('not a boolean'); // GOOD: Error - Argument not assignable to boolean

// Drop parameters until their length is 0 and then return type is R
// But as long as there are parameters, use recursion to keep dropping them
type CurryV3<P extends any[], R> =
    <T extends any[]>(...args: T) => Length<Drop<Length<T>, P>> extends 0
        ? R
        : CurryV3<Drop<Length<T>, P>, R>;

// V3 complains that our Drop is not of type any[] so we cast it to any[] because we know it is any[] anyway
// Same as V3 except we use Cast
type CurryV4<P extends any[], R> =
    <T extends any[]>(...args: Cast<T, Partial<P>>) => Length<Cast<Drop<Length<T>, P>, any[]>> extends 0
        ? R
        : CurryV4<Cast<Drop<Length<T>, P>, any[]>, R>;

// Using rest parameters in curry is not possible right now with our tools
// because when we use length to count the number of parmeters,
// when we use a rest arg, TS cannot count because they are potentially inifinite length
// therefore it returs its best guess: type number instead of an actual number
type restargs = [string, number, boolean, ...string[]];
type test46 = Length<restargs>; // number

// When all non-rest parameters are consumed, `Drop<Length<T>, P>` will extend [...any[]]
// and not [any, ...any[]] therefore the test will fail and R will be returned
type CurryV5<P extends any[], R> =
    <T extends any[]>(...args: Cast<T, Partial<P>>) => Drop<Length<T>, P> extends [any, ...any[]]
        ? CurryV5<Cast<Drop<Length<T>, P>, any[]>, R>
        : R;

declare function curryV5<P extends any[], R>(fn: (...args: P) => R): CurryV5<P, R>;

type Curry<F extends GenericFunction> =
    <T extends any[]>(...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>) =>
        GapsOf<T, Parameters<F>> extends [any, ...any[]]
        ? Curry<(...args: Cast<GapsOf<T, Parameters<F>>, any[]>) => ReturnType<F>>
        : ReturnType<F>

// declare function curry<F extends GenericFunction>(f: F): Curry<F>;

function curry<F extends GenericFunction>(fn: F): Curry<F> {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}