# usePromiseValue
Return a hook value as a promise

```
function anotherHook() {
    const { dependency } = useSomeHook();
    const [state, setState] = React.useState();
    const { promise, resolve } = usePromiseValue();

    React.useEffect(() => {
        if (!dependency) return;
        try {
            const stateVal = getValue({ dependency });
            resolve(stateVal);
            setState(stateVal);
        } catch (e) {
            console.error(e);
        }
    }, [dependency]);

    return {
        state,
        statePromise: promise,
    };
}

const { statePromise } = anotherHook();
const result = await statePromise;
```

this can be useful in situations where you want to click a button before some value becomes available (and dont want to re-render the component) and allow the button click action to await the promise
