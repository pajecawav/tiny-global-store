import { createStore } from "./";

describe("store", () => {
	it("accepts default value", () => {
		const store = createStore({ hello: "world", value: 123 });

		expect(store.get()).toStrictEqual({ hello: "world", value: 123 });
	});

	it("executes action without payload", () => {
		const store = createStore({ message: "test" });

		store.execute(state => ({ message: state.message.toUpperCase() }));

		expect(store.get()).toStrictEqual({ message: "TEST" });
	});

	it("executes action with payload", () => {
		const store = createStore({ num: 123 });

		store.execute((state, payload: number) => ({ num: state.num - payload }), 23);

		expect(store.get()).toStrictEqual({ num: 100 });
	});

	it("notifies subscribers about change", () => {
		const store = createStore(10);

		const subscriber = vi.fn();

		store.subscribe(subscriber);
		store.execute(value => value * 3);

		expect(subscriber).toHaveBeenCalledOnce();
		expect(subscriber).toHaveBeenCalledWith(30);
	});

	it("doesn't notify subscribers when state didn't change after executing an action", () => {
		const store = createStore(42);

		const subscriber = vi.fn();

		store.subscribe(subscriber);
		store.execute(value => value);

		expect(subscriber).not.toHaveBeenCalled();
	});

	it("correctly unsubscribes from changes via a method", () => {
		const store = createStore(5);

		const subscriber = vi.fn();

		const unsubscribe = store.subscribe(subscriber);
		store.unsubscribe(subscriber);

		store.execute(value => value * 4);

		expect(subscriber).not.toHaveBeenCalled();
	});

	it("correctly unsubscribes from changes via returned callback", () => {
		const store = createStore(-3);

		const subscriber = vi.fn();

		const unsubscribe = store.subscribe(subscriber);
		unsubscribe();

		store.execute(value => value * 6);

		expect(subscriber).not.toHaveBeenCalled();
	});
});
