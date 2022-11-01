"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getNetworkFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importRecoveryPhrase = exports.generateAddress = exports.formatValue = exports.config = void 0;
const terra_js_1 = require("@terra-money/terra.js");
const utils_1 = require("@terra.kitchen/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Utils
const api_1 = require("../../utils/api");
exports.config = {
    coins: ['luna', 'lunc'],
    isWithPhrase: true,
    extraIdName: 'Memo',
    isInternalTx: true,
};
const ten6 = new bignumber_js_1.default(10).pow(6);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten6));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten6));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const { accAddress: address, mnemonic, privateKey } = new terra_js_1.MnemonicKey();
    return {
        address,
        mnemonic,
        privateKey: privateKey.toString('hex'),
    };
};
exports.generateAddress = generateAddress;
const importRecoveryPhrase = async (recoveryPhrase) => {
    const { accAddress: address, mnemonic, privateKey, } = new terra_js_1.MnemonicKey({
        mnemonic: recoveryPhrase,
    });
    return {
        address,
        mnemonic,
        privateKey: privateKey.toString('hex'),
    };
};
exports.importRecoveryPhrase = importRecoveryPhrase;
const getExplorerLink = (address, chain) => {
    const network = chain === 'terra' ? 'mainnet' : 'classic';
    return `https://finder.terra.money/${network}/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash, chain) => {
    const network = chain === 'terra' ? 'mainnet' : 'classic';
    return `https://finder.terra.money/${network}/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        return terra_js_1.AccAddress.validate(address);
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const getLCDClient = async (denom, chain, gasPrices) => {
    const chainID = chain === 'terra' ? 'phoenix-1' : 'columbus-5';
    const URL = chain === 'terra' ? 'https://phoenix-lcd.terra.dev' : 'https://columbus-lcd.terra.dev';
    return new terra_js_1.LCDClient({
        URL,
        chainID,
        gasAdjustment: 2,
        gasPrices: { [denom]: gasPrices[denom] || 0 },
        isClassic: chain === 'terra-classic',
    });
};
const getGasAmount = (denom, gasPrices, estimatedGas) => {
    const gasPrice = gasPrices[denom];
    if (!gasPrice) {
        return '0';
    }
    return new bignumber_js_1.default(estimatedGas).times(gasPrice).integerValue(bignumber_js_1.default.ROUND_CEIL).toString();
};
const getNetworkFee = async (props) => {
    try {
        const { symbol, from, amount, chain } = props;
        const denom = symbol === 'ustc' ? 'uusd' : 'uluna';
        const wallet = await (0, exports.generateAddress)();
        const txParams = await (0, api_1.getTxParams)(chain);
        if (wallet && txParams) {
            const lcd = await getLCDClient(denom, chain, txParams.gasPrices);
            const unsignedTx = await lcd.tx.create([{ address: from }], {
                msgs: [
                    new terra_js_1.MsgSend(from, wallet.address, {
                        [denom]: (0, exports.formatValue)(amount, 'to'),
                    }),
                ],
                feeDenoms: [denom],
            });
            return {
                networkFee: +(0, utils_1.readAmount)(getGasAmount(denom, txParams.gasPrices, unsignedTx.auth_info.fee.gas_limit)),
            };
        }
        return {
            networkFee: 0,
        };
    }
    catch (_a) {
        return {
            networkFee: 0,
        };
    }
};
exports.getNetworkFee = getNetworkFee;
const createInternalTx = async (props) => {
    const { mnemonic, addressFrom, addressTo, amount, extraId, symbol, chain } = props;
    const denom = symbol === 'ustc' ? 'uusd' : 'uluna';
    const txParams = await (0, api_1.getTxParams)(chain);
    if (txParams && mnemonic) {
        const provider = await getLCDClient(denom, chain, txParams.gasPrices);
        const wallet = provider.wallet(new terra_js_1.MnemonicKey({
            mnemonic,
        }));
        const lcd = await getLCDClient(denom, chain, txParams.gasPrices);
        const unsignedTx = await lcd.tx.create([{ address: addressFrom }], {
            msgs: [
                new terra_js_1.MsgSend(addressFrom, addressTo, {
                    [denom]: (0, exports.formatValue)(amount, 'to'),
                }),
            ],
            feeDenoms: [denom],
        });
        const gasCoins = new terra_js_1.Coins([
            terra_js_1.Coin.fromData({
                amount: getGasAmount(denom, txParams.gasPrices, unsignedTx.auth_info.fee.gas_limit),
                denom,
            }),
        ]);
        const tx = await wallet.createAndSignTx({
            msgs: [
                new terra_js_1.MsgSend(addressFrom, addressTo, {
                    [denom]: (0, exports.formatValue)(amount, 'to'),
                }),
            ],
            memo: extraId,
            fee: new terra_js_1.Fee(unsignedTx.auth_info.fee.gas_limit, gasCoins),
        });
        const { txhash } = await provider.tx.broadcast(tx);
        return txhash;
    }
    return null;
};
exports.createInternalTx = createInternalTx;
