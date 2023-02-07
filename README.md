# tiny-global-store [![npm](https://img.shields.io/npm/v/tiny-global-store)](https://www.npmjs.com/package/tiny-global-store) ![bundle size](https://img.shields.io/bundlephobia/minzip/tiny-global-store?label=bundle%20size)

Tiny state management library for you React application.

## Install

```sh
npm install tiny-global-store

# or

yarn add tiny-global-store

# or

pnpm add tiny-global-store
```

## Usage

First you need to create a store with an initial value and a hook with all actions available for the store:

```ts
import { createStore, createHook } from "tiny-global-store";

interface Store {
    count: number;
    message: string;
}

const store = createStore<Store>({ count: 0, message: "Hello world!" });

const useCounterStore = createHook(store, {
    increase: store => ({ ...store, count: store.count + 1 }),
    reset: store => ({ ...store, count: 0 }),
});
```

Then you can use your store in any component:

```ts
function Counter() {
    const { state } = useCounterStore();
    return <h1>Current value is {state.count}</h1>;
}

function Controls() {
    const { actions } = useCounterStore();
    return (
        <>
            <button onClick={actions.increase}>Increase</button>
            <button onClick={actions.reset}>Reset</button>
        </>
    );
}
```
