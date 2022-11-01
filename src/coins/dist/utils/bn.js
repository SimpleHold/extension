"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.div = exports.plusString = exports.plus = exports.minusString = exports.minus = exports.multiplied = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const multiplied = (from, to) => {
    return new bignumber_js_1.default(from).multipliedBy(to).toNumber();
};
exports.multiplied = multiplied;
const minus = (from, to) => {
    return new bignumber_js_1.default(from).minus(new bignumber_js_1.default(to)).toNumber();
};
exports.minus = minus;
const minusString = (from, to) => {
    return new bignumber_js_1.default(from).minus(new bignumber_js_1.default(to)).toString();
};
exports.minusString = minusString;
const plus = (from, to) => {
    return new bignumber_js_1.default(from).plus(new bignumber_js_1.default(to)).toNumber();
};
exports.plus = plus;
const plusString = (from, to) => {
    return new bignumber_js_1.default(from).plus(new bignumber_js_1.default(to)).toString();
};
exports.plusString = plusString;
const div = (from, to) => {
    return new bignumber_js_1.default(from).div(new bignumber_js_1.default(to)).toString();
};
exports.div = div;
