"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (ms, shouldRejectWithMessage = ``) => new Promise((resolve, reject) => setTimeout(shouldRejectWithMessage
    ? () => reject(new Error(shouldRejectWithMessage))
    : resolve, ms));
exports.sleep = sleep;
