import RootStore from './store';
export declare const useStore: <Store>(storeSelector: (rootStore: RootStore) => Store) => Store;
