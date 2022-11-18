export interface INetworkInfo {
  name: string
  messagePrefix: string
  bech32: string
  bip32: {
    public: number
    private: number
  }
  pubKeyHash: number
  scriptHash: number
  wif: number
}

export const mainnet: INetworkInfo = {
  name: 'qtum',
  messagePrefix: '\u0015Qtum Signed Message:\n',
  bech32: 'bc',
  bip32: { public: 76067358, private: 76066276 },
  pubKeyHash: 58,
  scriptHash: 50,
  wif: 128,
}
