import { useSyncExternalStore } from "react";
import { IfVoid, IsUnknown } from "./helpers";

type Subscriber<TState> = (state: TState) => void;

type Action<TState, TPayload = void> = IsUnknown<
	TPayload,
	(state: TState) => TState,
	(state: TState, payload: TPayload) => TState
>;

type InferPayload<TAction extends Action<any, any>> = TAction extends Action<
	infer State,
	infer Payload
>
	? Payload
	: never;

class Store<TState> {
	private subscribers: Subscriber<TState>[] = [];

	constructor(private state: TState) {}

	get(): TState {
		return this.state;
	}

	subscribe(cb: Subscriber<TState>): () => void {
		this.subscribers.push(cb);
		return () => this.unsubscribe(cb);
	}

	unsubscribe(cb: Subscriber<TState>) {
		this.subscribers.filter(subscriber => subscriber !== cb);
	}

	execute<TPayload = void>(action: Action<TState, TPayload>, payload?: TPayload): TState {
		const prevState = this.state;

		// TODO: figure out how to properly type actions and this function to avoid casting to any
		this.state = action(this.state, payload as any);

		if (this.state !== prevState) {
			this.notify();
		}

		return this.state;
	}

	private notify() {
		for (const cb of this.subscribers) {
			cb(this.state);
		}
	}
}

export function createStore<TState>(state: TState): Store<TState> {
	return new Store(state);
}

type ActionsMap<TState> = Record<string, Action<TState, any>>;

type WrappedActionsMap<TState, TActions extends ActionsMap<TState>> = {
	[Key in keyof TActions]: IfVoid<
		InferPayload<TActions[Key]>,
		() => TState,
		(payload: InferPayload<TActions[Key]>) => TState
	>;
};

export function createHook<TState, TActions extends ActionsMap<TState>>(
	store: Store<TState>,
	actions?: TActions
) {
	function subscribe(cb: Subscriber<TState>) {
		return store.subscribe(cb);
	}

	function getSnapshot(): TState {
		return store.get();
	}

	const wrappedActions: WrappedActionsMap<TState, TActions> = {} as any;
	for (const [name, action] of Object.entries(actions ?? {})) {
		// TODO: figure out how to get rid of `any`
		const handler: any = (payload: any) => store.execute(action, payload);
		wrappedActions[name as keyof TActions] = handler;
	}

	return () => {
		const state = useSyncExternalStore(subscribe, getSnapshot);
		return { state, actions: wrappedActions };
	};
}
