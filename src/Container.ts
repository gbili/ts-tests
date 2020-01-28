import { curry, map, add } from 'ramda';

type AnyFunction<R = any> = (...args: any[]) => R;

interface Functor {
    map(fn: AnyFunction): Functor;
};

class Container<S> {
    constructor(private $value: S) {}

    static of(x: any) {
        return new Container(x);
    }

    map(fn: (x: S) => any) {
        return Container.of(fn(this.$value));
    }
}

const cn = Container.of(2).map(two => two + 2);
const cs = Container.of("Hello").map(x => x.toLowerCase());

const conatinerOfAdd2 = map(add, Container.of(2));