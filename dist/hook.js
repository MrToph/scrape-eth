"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const react_1 = require("react");
const store_1 = require("./store");
const useStore = (storeSelector) => {
    const value = react_1.useContext(store_1.storeContext);
    if (!value) {
        throw new Error(`storeContext does not have any value`);
    }
    const store = storeSelector(value);
    return store;
};
exports.useStore = useStore;
