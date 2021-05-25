export declare type ValidChains = "eth" | "bsc";
export declare type TActions = "INIT" | "SCRAPE" | "END";
export declare type TCliOptions = {
    url: string;
    chain: ValidChains;
};
export declare type TReducerAction<T> = {
    type: T;
    payload: any;
};
declare type TState = {
    lastAction: TActions;
    error: string;
    info: string;
    config: TCliOptions;
};
export declare const useAppState: (options: Partial<TCliOptions>) => [TState, () => Promise<void>];
export {};
