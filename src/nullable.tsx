import foo from "./asdf.js";


interface Dictionary<T> {
    [key: number]: T;
}

let c: Dictionary<number> = [42];
let v: Dictionary<number>[42];
let w: Dictionary<number> = {
    1: 3,
}
type FieldState = {
    value: string;
}
type FormState =
    {[fieldName: string]: FieldState} & {isValid: boolean} // [ts] Error - Property 'isValid' of type 'boolean' is not assignable to string index type 'FieldState'

const bar: FormState = {
    isValid: false,
}

bar.isValid;