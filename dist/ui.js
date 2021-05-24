"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const App = ({ name = 'Stranger' }) => (react_1.default.createElement(ink_1.Text, null,
    "Hello, ",
    react_1.default.createElement(ink_1.Text, { color: "green" }, name)));
module.exports = App;
exports.default = App;
