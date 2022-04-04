export function ReactiveFunc(funcs, handler) {
    return Object.assign({}, ...Object.values(Object.getOwnPropertyDescriptors(funcs))
        .filter(prop => typeof prop.value == 'function')
        .map(prop => ({
            [prop.value.name]: new Proxy(prop.value, Object.assign({}, ...Object.values(handler).map(e => ({
                [e.name]: e.bind(this),
            }))))
        })));
}