import { useState } from "react";

export type ValidChains = "eth" | "bsc";
export type TActions = "SCRAPE";
export type TCliOptions = { url: string; chain: ValidChains };
export type TReducerAction<T> = { type: T; payload: any };
type TState = {};
const getDefaultState = (options: Partial<TCliOptions>): TState => ({
	url: options.url || ``,
	chain: options.chain || `eth`,
});

async function reducer(
	state: TState,
	action: TReducerAction<TActions>
): Promise<TState> {
	switch (action.type) {
		case "SCRAPE":
			// Do async code here
			return state;
		default:
			throw new Error(`Wrong action "${action.type}"`);
	}
}

function useAsyncReducer(red: typeof reducer, initState: TState) {
	const [state, setState] = useState(initState),
		dispatchState = async (action: TReducerAction<TActions>) =>
			setState(await red(state, action));
	return [state, dispatchState];
}

export const useAppState = (options: Partial<TCliOptions>) => {
	return useAsyncReducer(reducer, getDefaultState(options));
};
