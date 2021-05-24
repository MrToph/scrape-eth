"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppState = void 0;
const react_1 = require("react");
const utils_1 = require("./utils");
const getNextAction = (action) => {
    const ordered = [`INIT`, `SCRAPE`, `END`];
    const currentIndex = ordered.findIndex((s) => s === action);
    if (currentIndex < 0)
        throw new Error(`Invalid action "${action}"`);
    if (currentIndex === ordered.length - 1)
        throw new Error(`Last action repeatedly called`);
    return ordered[currentIndex + 1];
};
const getDefaultState = (options) => ({
    lastAction: `INIT`,
    error: ``,
    config: {
        url: options.url || `https://yearn.finance/vaults`,
        chain: options.chain || `eth`,
    },
});
async function reducer(state
// action: TReducerAction<TActions>
) {
    const nextAction = getNextAction(state.lastAction);
    const newState = {
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
            }
            else if (![`eth`, `bsc`].includes(state.config.chain)) {
                return {
                    ...newState,
                    error: `Missing/invalid --chain parameter`,
                    lastAction: `END`,
                };
            }
            await utils_1.sleep(5000);
            return { ...newState, config: { ...state.config, url: `cool` } };
        }
        case "END": {
            return { ...newState };
        }
        default:
            throw new Error(`Missing action "${nextAction}"`);
    }
}
function useAsyncReducer(red, initState) {
    const [state, setState] = react_1.useState(initState), next = async ( /* action: TReducerAction<TActions> */) => setState(await red(state /*, action */));
    return [state, next];
}
const useAppState = (options) => {
    return useAsyncReducer(reducer, getDefaultState(options));
};
exports.useAppState = useAppState;
