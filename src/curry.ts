const curry = function (f: (...args: any[]) => any): (arg: any) => any {
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
const curry = function <T>(f: (...args: any[]) => T): (arg: any) => any {
    // get the list of arguments passed at call time to 
    return function curryfy(arg: any): (arg: any) =>  {
        if (arguments.length >= f.length) {
            return f.apply(null, Array.from(arguments));
        } else {
            return curryfy.bind(null, ...Array.from(arguments));
        }
    }
}

const curry = function (f) {
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
