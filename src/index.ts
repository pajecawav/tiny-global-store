import { useSyncExternalStore } from "react";

type Subscriber<TState> = (state: TState) => void;

// TODO: actions should take a payload as a second argument
type Action<TState> = (state: TState) => TState;

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

	execute(action: Action<TState>): TState {
		const prevState = this.state;

		this.state = action(this.state);

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

type ActionsMap<TState> = Record<string, Action<TState>>;

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

	const wrappedActions: { [Key in keyof TActions]: () => TState } = {} as any;
	for (const [name, action] of Object.entries(actions ?? {})) {
		wrappedActions[name as keyof TActions] = () => store.execute(action);
	}

	return () => {
		const state = useSyncExternalStore(subscribe, getSnapshot);
		return { state, actions: wrappedActions };
	};
}
