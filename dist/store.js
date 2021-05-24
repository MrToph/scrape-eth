"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeContext = exports.rootStore = void 0;
const react_1 = __importDefault(require("react"));
const mobx_1 = require("mobx");
const getDefaultState = (options) => ({
    url: options.url || ``,
    chain: options.chain || `eth`,
});
class RootStore {
    constructor() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "scrape", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                setTimeout(() => {
                    this.state.url = `works`;
                }, 5000);
            }
        });
    }
    init(options) {
        try {
            this.state = getDefaultState(options);
        }
        catch (error) {
            throw new Error(`Error while initializing store: ${error.message}`);
        }
    }
}
__decorate([
    mobx_1.observable
], RootStore.prototype, "state", void 0);
__decorate([
    mobx_1.action
], RootStore.prototype, "init", null);
__decorate([
    mobx_1.action
], RootStore.prototype, "scrape", void 0);
exports.default = RootStore;
exports.rootStore = new RootStore();
exports.storeContext = react_1.default.createContext(exports.rootStore);
