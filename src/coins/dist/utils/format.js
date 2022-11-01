"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLower = exports.toUpper = void 0;
const toUpper = (text) => {
    if (text === null || text === void 0 ? void 0 : text.length) {
        return text.toUpperCase();
    }
    return text;
};
exports.toUpper = toUpper;
const toLower = (text) => {
    if (text === null || text === void 0 ? void 0 : text.length) {
        return text.toLowerCase();
    }
    return text;
};
exports.toLower = toLower;
