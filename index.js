const React = require('react');

exports.usePromiseValue = usePromiseValue;
// usage example:
// export function anotherHook() {
//     const { dependency } = useSomeHook();
//     const [state, setState] = React.useState();
//     const { promise, resolve } = usePromiseValue();
//
//     React.useEffect(() => {
//         if (!dependency) return;
//         try {
//             const stateVal = getValue({ dependency });
//             resolve(stateVal);
//             setState(stateVal);
//         } catch (e) {
//             console.error(e);
//         }
//     }, [dependency]);
//
//     return {
//         state,
//         statePromise: promise,
//     };
// }
//
// const { statePromise } = anotherHook();
// const result = await statePromise;
//
// - this is useful when we want to click a button and fire off
//   an action, and dont want to add useEffects to check if a value is
//   present before dispatching the button action
//
// - working example:
//   https://jsfiddle.net/ahmadabdul3/atgcxhod/7/
//

// - not passing dependencies will only make this hook resolve 1 promise
function usePromiseValue({
    deps = [],
    promiseUpdateTimeout = 200,
} = {}) {
	const [count, setCount] = React.useState(0);
    const [mountRender, setMountRender] = React.useState(true);
    const resolve = React.useRef();
    const promise = React.useRef(new Promise(_resolve => {
        // - useRef is actually called on every render, but the
        //   subsequent result is discarded
        // - however, this can cause the `resolve.current` to be overwritten
        //   which will make the initial promise unresolvable
        // - this condition takes care of ensuring we always resolve the
        //   first promise
        if (!resolve.current) resolve.current = _resolve;
    }));

    React.useEffect(() => {
        setMountRender(false);
    }, []);

    React.useEffect(() => {
        if (mountRender) return;
        setTimeout(() => {
            setCount(count + 1);
        }, promiseUpdateTimeout);
        // - dont update the promise/resolve combo right away,
        //   otherwise the current promise will not resolve
        // - instead, wait a short period (100-300 ms after state updates)
        //   to give the current promise time to resolve before updating
    }, [...deps]);

    React.useEffect(() => {
        if (mountRender) return;
        promise.current = new Promise(r => resolve.current = r);
    }, [count]);

    return {
        promise: promise.current,
        resolve: resolve.current,
    };
}
