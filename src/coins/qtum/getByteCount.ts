type TInput = {
  [type: string]: number
}

type TInputValue = {
  inputs: TInput
  outputs: TInput
}

const checkUInt53 = (n: number) => {
  if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0) {
    throw new RangeError('value out of range')
  }
}

const varIntLength = (number: number): number => {
  checkUInt53(number)

  return number < 0xfd ? 1 : number <= 0xffff ? 3 : number <= 0xffffffff ? 5 : 9
}

const types: TInputValue = {
  inputs: {
    'MULTISIG-P2SH': 51 * 4,
    'MULTISIG-P2WSH': 8 + 41 * 4,
    'MULTISIG-P2SH-P2WSH': 8 + 76 * 4,
    P2PKH: 148 * 4,
    P2WPKH: 108 + 41 * 4,
    'P2SH-P2WPKH': 108 + 64 * 4,
  },
  outputs: {
    P2SH: 32 * 4,
    P2PKH: 34 * 4,
    P2WPKH: 31 * 4,
    P2WSH: 43 * 4,
  },
}

const getByteCount = (inputs: TInput, outputs: TInput): number => {
  let totalWeight = 0
  let hasWitness = false
  let inputCount = 0
  let outputCount = 0

  Object.keys(inputs).forEach((key) => {
    checkUInt53(inputs[key])
    if (key.slice(0, 8) === 'MULTISIG') {
      const keyParts = key.split(':')
      if (keyParts.length !== 2) {
        throw new Error('invalid input: ' + key)
      }
      const newKey = keyParts[0]
      const mAndN = keyParts[1].split('-').map(function (item) {
        return parseInt(item)
      })

      totalWeight += types.inputs[newKey] * inputs[key]
      const multiplyer = newKey === 'MULTISIG-P2SH' ? 4 : 1
      totalWeight += (73 * mAndN[0] + 34 * mAndN[1]) * multiplyer * inputs[key]
    } else {
      totalWeight += types.inputs[key] * inputs[key]
    }
    inputCount += inputs[key]
    if (key.indexOf('W') >= 0) {
      hasWitness = true
    }
  })

  Object.keys(outputs).forEach((key) => {
    checkUInt53(outputs[key])
    totalWeight += types.outputs[key] * outputs[key]
    outputCount += outputs[key]
  })

  if (hasWitness) {
    totalWeight += 2
  }

  totalWeight += 8 * 4
  totalWeight += varIntLength(inputCount) * 4
  totalWeight += varIntLength(outputCount) * 4

  return Math.ceil(totalWeight / 4)
}

export default getByteCount
