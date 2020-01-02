// Require that K type variable is of type string
// require that all of the strings in the type (Union\
// like e.g. "myProp" | "hello", or keyof typeof myObject)
// 
// passed as paramter K has a corresponding property 
// in the resulting object
type FromSomeIndex<K extends string> = {
    [key in K]: number;
};

const a = {
    a: "",
    b: "",
    c: "",
    d: 12,
    f() {},
    f1(...a: any[]) { return a; },
    f2() { throw new Error(); },
}

type A = typeof a;
// get the type of object a
// get the keys from that type
type FunctionPropNames<T> = {
    [K in keyof T]: T[K] extends Function
    ? K
    : never
}[keyof T]; 

/**
 * For a type T, give a set of keys K being property names of T
 * Return an object type {}
 * Containing the picked keys P in the set K, and their type T[P]
 */ 
type Picky<T, K extends keyof T> = {
    [P in K]: T[P];
};
// since the picked P and the K are the same set, we can skip it
type Picked<T, K extends keyof T> = {
    [key in K]: T[K];
};

/**
 * Exclude from T those props that are passed as K
 * Pick from T only those L that are not passed as K
 */
type PickDiff<T, K extends keyof T> = Picky<T, {
    [L in keyof T]: L extends K
    ? never
    : L
}[keyof T]>;

type AFuncPropNames = FunctionPropNames<A>; // "f" | "f1" | "f2"
type ATypeWithFuncProps = Picky<A, FunctionPropNames<A>>; // {
//    f: () => void;
//    f1: (...a: any[]) => any[];
//    f2: () => never;
// } 
type ATypeWithoutFuncProps = PickDiff<A, FunctionPropNames<A>>; // {
//    a: string;
//    b: string;
//    c: string;
//    d: number;
// } 

// of similarly
type ANonFuncPropNames = Exclude<keyof A, FunctionPropNames<A>>; // "a" | "b" | "c" | "d"
type ATypeWithFuncProps2 = Pick<A, ANonFuncPropNames>; // {
//    a: string;
//    b: string;
//    c: string;
//    d: number;
// }

const bad: FromSomeIndex<"myIndex"> = { // [ts] Error - property 'myIndex' is missing in type '{}'
};

const bad2: FromSomeIndex<"myIndex"> = { 
    anotherIndexName: 12, // [ts] Error - type { anotherIndexName: number} is not assignable to type FromSomeIndex<"myIndex">
};

const bad3: FromSomeIndex<"myIndex"> = { // [ts] Ok
    myIndex: 12,
    anotherIndexName: 12, // [ts] Error - type
};

const bad4: FromSomeIndex<"myIndex" | "anotherIndexName"> = { // [ts] Error - 'anotherIndexName' is missing from type { myIndex: number; }
    myIndex: 12,
};

const good2: FromSomeIndex<"myIndex" | "anotherIndexName"> = { // [ts] Ok
    myIndex: 12,
    anotherIndexName: 12,
};

const good: FromSomeIndex<"myIndex"> = { // [ts] Ok
    myIndex: 12,
};

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];