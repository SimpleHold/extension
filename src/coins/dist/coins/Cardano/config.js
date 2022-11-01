"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shelleyStakeAccountPath = exports.shelleyPath = exports.HARDENED_THRESHOLD = void 0;
exports.HARDENED_THRESHOLD = 0x80000000;
exports.shelleyPath = [
    exports.HARDENED_THRESHOLD + 1852,
    exports.HARDENED_THRESHOLD + 1815,
    exports.HARDENED_THRESHOLD,
    0,
    0,
];
exports.shelleyStakeAccountPath = [
    exports.HARDENED_THRESHOLD + 1852,
    exports.HARDENED_THRESHOLD + 1815,
    exports.HARDENED_THRESHOLD,
    2,
    0,
];
