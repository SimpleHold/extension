import {
  derivePrivate,
  bech32,
  packBaseAddress,
  getPubKeyBlake2b224Hash,
  derivePublic,
  sign as signMsg,
} from 'cardano-crypto.js';
import { Buffer } from 'buffer';
import { encode } from 'borc';

// Config
import { HARDENED_THRESHOLD, shelleyPath } from './config';

// Types
import {
  BIP32Path,
  _THdNode,
  THdNode,
  TxAux,
  TxSigned,
  CborizedTxSignedStructured,
  TxShelleyWitness,
  AddressToPathMapper,
  CborizedTxWitnesses,
  TxWitnessKey,
  CborizedTxWitnessShelley,
} from './types';

const _HdNode = ({ secretKey, publicKey, chainCode }: THdNode): _THdNode => {
  const extendedPublicKey = Buffer.concat([publicKey, chainCode], 64);

  function toBuffer() {
    return Buffer.concat([secretKey, extendedPublicKey]);
  }

  function toString() {
    return toBuffer().toString('hex');
  }

  return {
    secretKey,
    publicKey,
    chainCode,
    extendedPublicKey,
    toBuffer,
    toString,
  };
};

const HdNode = (secret: Buffer): _THdNode => {
  const secretKey = secret.slice(0, 64);
  const publicKey = secret.slice(64, 96);
  const chainCode = secret.slice(96, 128);

  return _HdNode({ secretKey, publicKey, chainCode });
};

const indexIsHardened = (index: number) => {
  return index >= HARDENED_THRESHOLD;
};

const isShelleyPath = (path: BIP32Path) => {
  return path[0] - HARDENED_THRESHOLD === 1852;
};

const CachedDeriveXpubFactory = (
  shouldExportPubKeyBulk: boolean,
  deriveXpubsHardenedFn: (derivationPaths: BIP32Path[]) => Buffer[]
) => {
  const derivedXpubs: { [i: string]: any } = {};

  async function deriveXpub(absDerivationPath: BIP32Path): Promise<Buffer> {
    const memoKey = JSON.stringify(absDerivationPath);

    if (!derivedXpubs[memoKey]) {
      const deriveHardened =
        absDerivationPath.length === 0 || indexIsHardened(absDerivationPath.slice(-1)[0]);
      if (deriveHardened) {
        const derivationPaths =
          shouldExportPubKeyBulk && isShelleyPath(absDerivationPath)
            ? createPathBulk(absDerivationPath)
            : [absDerivationPath];
        const pubKeys = await _deriveXpubsHardenedFn(derivationPaths);
        Object.assign(derivedXpubs, pubKeys);
      } else {
        derivedXpubs[memoKey] = await deriveXpubNonhardenedFn(absDerivationPath);
      }
    }

    return derivedXpubs[memoKey];
  }

  async function deriveXpubNonhardenedFn(derivationPath: BIP32Path) {
    const lastIndex = derivationPath.slice(-1)[0];
    const parentXpub = await deriveXpub(derivationPath.slice(0, -1));
    return derivePublic(parentXpub, lastIndex, 2);
  }

  function* makeBulkAccountIndexIterator() {
    yield [0, 4];
    yield [5, 16];
    for (let i = 17; true; i += 18) {
      yield [i, i + 17];
    }
  }

  function getAccountIndexExportInterval(accountIndex: number): [number, number] {
    const bulkAccountIndexIterator = makeBulkAccountIndexIterator();
    for (const [startIndex, endIndex] of bulkAccountIndexIterator) {
      if (accountIndex >= startIndex && accountIndex <= endIndex) {
        return [startIndex, endIndex];
      }
    }
    return [0, 0];
  }

  function createPathBulk(derivationPath: BIP32Path): BIP32Path[] {
    const paths: BIP32Path[] = [];
    const accountIndex = derivationPath[2] - HARDENED_THRESHOLD;
    const [startIndex, endIndex] = getAccountIndexExportInterval(accountIndex);

    for (let i = startIndex; i <= endIndex; i += 1) {
      const nextAccountIndex = i + HARDENED_THRESHOLD;
      const nextAccountPath = [...derivationPath.slice(0, -1), nextAccountIndex];
      paths.push(nextAccountPath);
    }

    return paths;
  }

  async function _deriveXpubsHardenedFn(derivationPaths: BIP32Path[]): Promise<any> {
    const xPubBulk = await deriveXpubsHardenedFn(derivationPaths);
    const _derivedXpubs: { [i: string]: Buffer } = {};
    xPubBulk.forEach((xpub: Buffer, i: number) => {
      const memoKey = JSON.stringify(derivationPaths[i]);
      _derivedXpubs[memoKey] = xpub;
    });
    return _derivedXpubs;
  }

  return deriveXpub;
};

function ShelleySignedTransactionStructured(
  txAux: TxAux,
  txWitnesses: CborizedTxWitnesses
): CborizedTxSignedStructured {
  function getId(): string {
    return txAux.getId();
  }

  function encodeCBOR(encoder: any) {
    return encoder.pushAny([txAux, txWitnesses, null]);
  }

  return {
    getId,
    encodeCBOR,
  };
}

export const getCryptoProvider = async (rootSecret: Buffer): Promise<any> => {
  const masterHdNode = HdNode(rootSecret);

  function deriveHdNode(derivationPath: BIP32Path): _THdNode {
    return derivationPath.reduce(deriveChildHdNode, masterHdNode);
  }

  function deriveChildHdNode(hdNode: _THdNode, childIndex: number): _THdNode {
    const result = derivePrivate(hdNode.toBuffer(), childIndex, 2);

    return HdNode(result);
  }

  const deriveXpub = CachedDeriveXpubFactory(true, (derivationPaths: BIP32Path[]) => {
    return derivationPaths.map((path) => deriveHdNode(path).extendedPublicKey);
  });

  const sign = async (message: string, keyDerivationPath: BIP32Path): Promise<Buffer> => {
    const hdNode = deriveHdNode(keyDerivationPath);
    const messageToSign = Buffer.from(message, 'hex');
    return signMsg(messageToSign, hdNode.toBuffer());
  };

  const prepareShelleyWitness = async (
    txHash: string,
    path: BIP32Path
  ): Promise<TxShelleyWitness> => {
    const signature = await sign(txHash, path);
    const xpub = await deriveXpub(path);
    const publicKey = xpub2pub(xpub);

    return { publicKey, signature };
  };

  const prepareWitnesses = async (txAux: TxAux, addressToAbsPathMapper: AddressToPathMapper) => {
    const { inputs, certificates, withdrawals, getId } = txAux;

    const txHash = getId();
    const _shelleyWitnesses: Array<Promise<TxShelleyWitness>> = [];

    inputs.forEach(() => {
      try {
        const spendingPath = shelleyPath;

        if (isShelleyPath(shelleyPath)) {
          _shelleyWitnesses.push(prepareShelleyWitness(txHash, spendingPath));
        }
      } catch {
        //
      }
    });
    [...certificates, ...withdrawals].forEach(({ stakingAddress }) => {
      const stakingPath = addressToAbsPathMapper(stakingAddress);
      _shelleyWitnesses.push(prepareShelleyWitness(txHash, stakingPath));
    });

    const shelleyWitnesses: TxShelleyWitness[] = await Promise.all(_shelleyWitnesses);

    return shelleyWitnesses;
  };

  function cborizeTxWitnessesShelley(
    shelleyWitnesses: TxShelleyWitness[]
  ): CborizedTxWitnessShelley[] {
    const txWitnessesShelley: CborizedTxWitnessShelley[] = shelleyWitnesses.map(
      ({ publicKey, signature }) => [publicKey, signature]
    );
    return txWitnessesShelley;
  }

  function cborizeTxWitnesses(shelleyWitnesses: TxShelleyWitness[]): CborizedTxWitnesses {
    const txWitnesses: CborizedTxWitnesses = new Map();

    if (shelleyWitnesses.length > 0) {
      txWitnesses.set(TxWitnessKey.SHELLEY, cborizeTxWitnessesShelley(shelleyWitnesses));
    }
    return txWitnesses;
  }

  const signTxGetStructured = async (
    txAux: TxAux,
    addressToPathMapper: AddressToPathMapper
  ): Promise<CborizedTxSignedStructured> => {
    const shelleyWitnesses = await prepareWitnesses(txAux, addressToPathMapper);

    const txWitnesses = cborizeTxWitnesses(shelleyWitnesses);

    return ShelleySignedTransactionStructured(txAux, txWitnesses);
  };

  const signTx = async (
    txAux: TxAux,
    addressToPathMapper: AddressToPathMapper
  ): Promise<TxSigned> => {
    const structuredTx = await signTxGetStructured(txAux, addressToPathMapper);

    return {
      txBody: encode(structuredTx).toString('hex'),
      txHash: structuredTx.getId(),
    };
  };

  return {
    deriveXpub,
    sign,
    signTx,
  };
};

export const xpub2pub = (xpub: Buffer): Buffer => {
  return xpub.slice(0, 32);
};

export const baseAddressFromXpub = (spendXpub: Buffer, stakeXpub: Buffer) => {
  const addrBuffer = packBaseAddress(
    getPubKeyBlake2b224Hash(xpub2pub(spendXpub)),
    getPubKeyBlake2b224Hash(xpub2pub(stakeXpub)),
    1
  );

  return bech32.encode('addr', addrBuffer);
};
