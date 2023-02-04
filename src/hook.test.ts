import { act, renderHook } from "@testing-library/react";
import { createHook, createStore } from "./";

describe("hook", () => {
	it("accepts default store value", () => {
		const store = createStore({ hello: "world", value: 123 });
		const useStore = createHook(store);

		const { result } = renderHook(() => useStore());

		expect(result.current.state).toStrictEqual({ hello: "world", value: 123 });
	});

	it("rerenders after executing an action", () => {
		const store = createStore(0);
		const useStore = createHook(store, {
			increment: value => value + 5,
		});

		const { result } = renderHook(() => useStore());

		act(() => {
			result.current.actions.increment();
		});

		expect(result.current.state).toBe(5);
	});

	it("actions can accept a payload", () => {
		const store = createStore(-7);
		const useStore = createHook(store, {
			multiply: (value, by: number) => value * by,
		});

		const { result } = renderHook(() => useStore());

		act(() => {
			result.current.actions.multiply(3);
		});

		expect(result.current.state).toBe(-21);
	});
});
