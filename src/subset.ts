// make a function that will pick a subset of properties from an object
// and return it in anohter object
const subsetOk: <T, K extends keyof T>(o: T, props: K[]) => Readonly<{[P in K]: T[P]}> = (o, props) => {
    const retO = {} as {[P in typeof props[number]]: typeof o[P]} ; // as SubsetOf<typeof o, typeof props[number]>
    props.forEach(
        p => retO[p] = o[p]
    );
    return Object.freeze(retO);
};

const subsetOk1: <T, K extends keyof T>(o: T, props: K[]) => Readonly<{[P in K]: T[P]}> = (o, props) => {
    const retO = {} as Pick<typeof o, typeof props[number]>;
    props.forEach(
        p => retO[p] = o[p]
    );
    return Object.freeze(retO);
};

const subsetBroken: <T, K extends keyof T>(o: T, props: K[]) => Readonly<Pick<T, K>> = (o, props) => {
    const retO = {} as Pick<typeof o, typeof props[number]>; // as SubsetOf<typeof o, typeof props[number]>
    props.forEach(
        p => retO[p] = o[p]
    );
    return Object.freeze(retO);
};

const fullA = { a: 1, b: "", c: 3, };
const subsetOfA = subsetOk(fullA, ["a", "b"]);
console.log(subsetOfA);

// using Pick in the body still works 
const subsetOfA0 = subsetOk1(fullA, ["a", "b"]);
console.log(subsetOfA);

// using Pick in the return type breaks the thing
const subsetOfA1 = subsetBroken(fullA, ["a", "b"]);
console.log(subsetOfA);