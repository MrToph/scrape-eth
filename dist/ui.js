"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const state_1 = require("./state");
const App = (cliOptions) => {
    const { exit } = ink_1.useApp();
    const [state, next] = state_1.useAppState(cliOptions);
    react_1.useEffect(() => {
        if (state.lastAction !== `END`) {
            next();
        }
        // const keepAlive = setInterval(() => {}, 1000000);
        // return () => {
        // 	clearInterval(keepAlive);
        // };
    }, [state.lastAction]);
    if (state.error) {
        return react_1.default.createElement(ink_1.Text, { color: "red" },
            "Error: ",
            state.error,
            ".");
        ;
    }
    return react_1.default.createElement(ink_1.Text, { color: "green" },
        state.config.url,
        " tests passed");
};
exports.default = App;
