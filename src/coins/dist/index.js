'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Aptos = exports.Casper = exports.Elrond = exports.FioProtocol = exports.Iotex = exports.PolkadotLike = exports.Solana = exports.Neblio = exports.Iota = exports.Icon = exports.Near = exports.Qtum = exports.Waves = exports.Terra = exports.Xinfin = exports.Tezos = exports.Zilliqa = exports.Harmony = exports.Stellar = exports.Xrp = exports.Nerve = exports.Nuls = exports.Neo = exports.Theta = exports.Tron = exports.Cardano = exports.BitcoinLike = void 0
const BitcoinLike = __importStar(require('./coins/BitcoinLike'))
exports.BitcoinLike = BitcoinLike
const Cardano = __importStar(require('./coins/Cardano'))
exports.Cardano = Cardano
const Tron = __importStar(require('./coins/Tron'))
exports.Tron = Tron
const Theta = __importStar(require('./coins/Theta'))
exports.Theta = Theta
const Neo = __importStar(require('./coins/Neo'))
exports.Neo = Neo
const Nuls = __importStar(require('./coins/Nuls'))
exports.Nuls = Nuls
const Nerve = __importStar(require('./coins/Nerve'))
exports.Nerve = Nerve
const Xrp = __importStar(require('./coins/Xrp'))
exports.Xrp = Xrp
const Stellar = __importStar(require('./coins/Stellar'))
exports.Stellar = Stellar
const Harmony = __importStar(require('./coins/Harmony'))
exports.Harmony = Harmony
const Zilliqa = __importStar(require('./coins/Zilliqa'))
exports.Zilliqa = Zilliqa
const Tezos = __importStar(require('./coins/Tezos'))
exports.Tezos = Tezos
const Xinfin = __importStar(require('./coins/Xinfin'))
exports.Xinfin = Xinfin
const Terra = __importStar(require('./coins/Terra'))
exports.Terra = Terra
const Waves = __importStar(require('./coins/Waves'))
exports.Waves = Waves
const Qtum = __importStar(require('./coins/Qtum'))
exports.Qtum = Qtum
const Near = __importStar(require('./coins/Near'))
exports.Near = Near
const Icon = __importStar(require('./coins/Icon'))
exports.Icon = Icon
const Iota = __importStar(require('./coins/Iota'))
exports.Iota = Iota
const Neblio = __importStar(require('./coins/Neblio'))
exports.Neblio = Neblio
const Solana = __importStar(require('./coins/Solana'))
exports.Solana = Solana
const PolkadotLike = __importStar(require('./coins/PolkadotLike'))
exports.PolkadotLike = PolkadotLike
const Iotex = __importStar(require('./coins/Iotex'))
exports.Iotex = Iotex
const FioProtocol = __importStar(require('./coins/FioProtocol'))
exports.FioProtocol = FioProtocol
const Elrond = __importStar(require('./coins/Elrond'))
exports.Elrond = Elrond
const Casper = __importStar(require('./coins/Casper'))
exports.Casper = Casper
const Aptos = __importStar(require('./coins/Aptos'))
exports.Aptos = Aptos
