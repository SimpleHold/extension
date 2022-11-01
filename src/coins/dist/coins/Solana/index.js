"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalTx = exports.getStandingFee = exports.validateAddress = exports.getTransactionLink = exports.getExplorerLink = exports.importPrivateKey = exports.generateAddress = exports.formatValue = exports.config = void 0;
const solanaWeb3 = __importStar(require("@solana/web3.js"));
const solanaSpl = __importStar(require("@solana/spl-token"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bs58_1 = __importDefault(require("bs58"));
exports.config = {
    coins: ['sol'],
    isInternalTx: true,
};
const ten9 = new bignumber_js_1.default(10).pow(9);
const formatValue = (value, type) => {
    if (type === 'from') {
        return Number(new bignumber_js_1.default(value).div(ten9));
    }
    return Number(new bignumber_js_1.default(value).multipliedBy(ten9));
};
exports.formatValue = formatValue;
const generateAddress = async () => {
    const wallet = solanaWeb3.Keypair.generate();
    return {
        address: wallet.publicKey.toString(),
        privateKey: bs58_1.default.encode(wallet.secretKey),
    };
};
exports.generateAddress = generateAddress;
const getKeypairFromPrivateKey = (privateKey) => {
    try {
        return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
    }
    catch (_a) {
        try {
            return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58_1.default.decode(privateKey)));
        }
        catch (_b) {
            return null;
        }
    }
};
const importPrivateKey = async (privateKey) => {
    const keyPair = getKeypairFromPrivateKey(privateKey);
    if (keyPair) {
        return keyPair.publicKey.toString();
    }
    return null;
};
exports.importPrivateKey = importPrivateKey;
const getExplorerLink = (address) => {
    return `https://explorer.solana.com/address/${address}`;
};
exports.getExplorerLink = getExplorerLink;
const getTransactionLink = (hash) => {
    return `https://explorer.solana.com/tx/${hash}`;
};
exports.getTransactionLink = getTransactionLink;
const validateAddress = (address) => {
    try {
        new solanaWeb3.PublicKey(address);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.validateAddress = validateAddress;
const addressToPubKey = (address) => {
    return new solanaWeb3.PublicKey(address);
};
const getStandingFee = () => {
    return 0.000005;
};
exports.getStandingFee = getStandingFee;
const transferToken = async (params) => {
    try {
        const { contractAddress, privateKey, addressTo, amount, addressFrom, decimals } = params;
        if (!privateKey) {
            return null;
        }
        const keyPair = getKeypairFromPrivateKey(privateKey);
        if (contractAddress && keyPair && decimals) {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
            const value = Number(new bignumber_js_1.default(amount).multipliedBy(new bignumber_js_1.default(10).pow(decimals)));
            const token = new solanaSpl.Token(connection, new solanaWeb3.PublicKey(contractAddress), solanaSpl.TOKEN_PROGRAM_ID, keyPair);
            const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(addressToPubKey(addressFrom));
            const associatedDestinationTokenAddr = await solanaSpl.Token.getAssociatedTokenAddress(token.associatedProgramId, token.programId, new solanaWeb3.PublicKey(contractAddress), addressToPubKey(addressTo));
            const receiverAccount = await connection.getAccountInfo(addressToPubKey(addressTo));
            const instructions = [];
            if (receiverAccount !== null &&
                receiverAccount.owner.toBase58() !== addressToPubKey(addressTo).toBase58()) {
                instructions.push(solanaSpl.Token.createSetAuthorityInstruction(solanaSpl.TOKEN_PROGRAM_ID, fromTokenAccount.address, addressToPubKey(addressTo), 'AccountOwner', keyPair.publicKey, []));
            }
            else {
                if (receiverAccount === null) {
                    instructions.push(solanaSpl.Token.createAssociatedTokenAccountInstruction(token.associatedProgramId, token.programId, new solanaWeb3.PublicKey(contractAddress), associatedDestinationTokenAddr, addressToPubKey(addressTo), keyPair.publicKey));
                }
                instructions.push(solanaSpl.Token.createTransferInstruction(solanaSpl.TOKEN_PROGRAM_ID, fromTokenAccount.address, associatedDestinationTokenAddr, keyPair.publicKey, [], value));
            }
            const transaction = new solanaWeb3.Transaction().add(...instructions);
            return await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [keyPair]);
        }
        return null;
    }
    catch (_a) {
        return null;
    }
};
const createInternalTx = async (params) => {
    try {
        const { addressFrom, addressTo, amount, privateKey, contractAddress } = params;
        if (privateKey) {
            if (contractAddress) {
                return await transferToken(params);
            }
            const keyPair = getKeypairFromPrivateKey(privateKey);
            if (keyPair) {
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
                const transaction = new solanaWeb3.Transaction().add(solanaWeb3.SystemProgram.transfer({
                    fromPubkey: addressToPubKey(addressFrom),
                    toPubkey: addressToPubKey(addressTo),
                    lamports: (0, exports.formatValue)(amount, 'to'),
                }));
                const sendTx = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [
                    keyPair,
                ]);
                return sendTx;
            }
        }
        return null;
    }
    catch (_a) {
        return null;
    }
};
exports.createInternalTx = createInternalTx;
