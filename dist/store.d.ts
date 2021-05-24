import React from "react";
export declare type ValidChains = "eth" | "bsc";
export declare type TActions = "SCRAPE";
export declare type TCliOptions = {
    url: string;
    chain: ValidChains;
};
export declare type TReducerAction<T> = {
    type: T;
    payload: any;
};
declare type TState = {
    url: string;
    chain: ValidChains;
};
export default class RootStore {
    state: TState;
    init(options: Partial<TCliOptions>): void;
    scrape: () => Promise<void>;
}
export declare const rootStore: RootStore;
export declare const storeContext: React.Context<RootStore>;
export {};
