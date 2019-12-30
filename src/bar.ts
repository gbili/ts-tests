const bar = {
    get: foo => foo.bar,
    mod: f => foo => ({
        ...foo,
        bar: f(foo.bar),
    }),
};

// more verbose arrow functions 

const bar = {
    get: (foo) => foo.bar,
    mod: (f) => {
        return (foo) => {
            return {
                ...foo,
                bar: f(foo.bar),
            };
        };
    }
};

// without arrow functions

const bar = {
    get: function (foo) {
        return foo.bar;
    },
    mod: function (f) {
        return function (foo) {
            return {
                ...foo,
                bar: f(foo.bar),
            };
        };
    }
};

// Old school

var bar = {
    get: function (foo) {
        return foo.bar;
    },
    mod: function (f) {
        return function (foo) {
            return Object.assign(
                {},
                { bar: f(foo.bar), },
                foo
            );
        };
    }
};