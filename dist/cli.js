#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const meow_1 = __importDefault(require("meow"));
const ui_1 = __importDefault(require("./ui"));
const cli = meow_1.default(`
	Usage
	  $ scrape-eth

	Options
		--name  Your name

	Examples
	  $ scrape-eth --name=Jane
	  Hello, Jane
`, {
    flags: {
        url: {
            type: 'string'
        },
        chain: {
            type: 'string'
        }
    }
});
ink_1.render(react_1.default.createElement(ui_1.default, { url: cli.flags.url, chain: cli.flags.url }));
