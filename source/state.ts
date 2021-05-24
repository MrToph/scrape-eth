import { useState } from "react";
import { sleep } from "./utils";

export type ValidChains = "eth" | "bsc";
export type TActions = "INIT" | "SCRAPE" | "END";
const getNextAction = (action: TActions) => {
	const ordered: TActions[] = [`INIT`, `SCRAPE`, `END`];
	const currentIndex = ordered.findIndex((s) => s === action);
	if (currentIndex < 0) throw new Error(`Invalid action "${action}"`);
	if (currentIndex === ordered.length - 1)
		throw new Error(`Last action repeatedly called`);

	return ordered[currentIndex + 1]!;
};

export type TCliOptions = { url: string; chain: ValidChains };
export type TReducerAction<T> = { type: T; payload: any };
type TState = {
	lastAction: TActions;
	error: string;
	config: TCliOptions;
};
const getDefaultState = (options: Partial<TCliOptions>): TState => ({
	lastAction: `INIT`,
	error: ``,
	config: {
		url: options.url || `https://yearn.finance/vaults`,
		chain: options.chain || `eth`,
	},
});

async function reducer(
	state: TState
	// action: TReducerAction<TActions>
): Promise<TState> {
	const nextAction = getNextAction(state.lastAction);
	const newState: TState = {
		...state,
		lastAction: nextAction,
	};
	switch (nextAction) {
		case "SCRAPE": {
			if (!state.config.url) {
				return {
					...newState,
					error: `Missing --url parameter`,
					lastAction: `END`,
				};
			} else if (![`eth`, `bsc`].includes(state.config.chain)) {
				return {
					...newState,
					error: `Missing/invalid --chain parameter`,
					lastAction: `END`,
				};
			}

			await sleep(5000);

			return { ...newState, config: { ...state.config, url: `cool` } };
		}
		case "END": {
			return { ...newState };
		}
		default:
			throw new Error(`Missing action "${nextAction}"`);
	}
}

function useAsyncReducer(red: typeof reducer, initState: TState) {
	const [state, setState] = useState(initState),
		next = async (/* action: TReducerAction<TActions> */) =>
			setState(await red(state /*, action */));
	return [state, next] as [TState, typeof next];
}

export const useAppState = (options: Partial<TCliOptions>) => {
	return useAsyncReducer(reducer, getDefaultState(options));
};
