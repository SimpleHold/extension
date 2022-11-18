import * as React from 'react'
import SVG from 'react-inlinesvg'
import { observer } from 'mobx-react-lite'
import { NumberFormatValues } from 'react-number-format'

// Components
import FeeButton from '../FeeButton'
import Warning from '../Warning'

// Utils
import { price, toUpper } from '@utils/format'
import { multiplied, div } from '@utils/bn'
import { getOutputs } from '@utils/api'
import { TFee } from '@utils/api/types'

// Coins
import { getNetworkFee, checkWithOutputs } from '@coins/index'
import { TUnspentOutput } from '@coins/types'
import { getUtxos as getVergeUtxos } from '@coins/verge'

// Tokens
import { getToken } from '@tokens/index'

// Store
import { useSendStore } from '@store/send/store'
import { fees } from '@store/send/data'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Assets
import sendShuffleArrowsIcon from '@assets/icons/sendShuffleArrows.svg'

// Styles
import Styles from './styles'

interface Props {
  coinPrice: number
  openFrom?: string
}

type TInputType = 'amount' | 'estimated'

const SendForm: React.FC<Props> = (props) => {
  const { coinPrice, openFrom } = props

  const [inputType, setInputType] = React.useState<TInputType>('amount')
  const [outputs, setOutputs] = React.useState<TUnspentOutput[]>([])
  const [usdAmount, setUsdAmount] = React.useState<string>('')

  const {
    amount,
    setAmount,
    balance,
    wallet,
    isFeeLoading,
    warning,
    currencyInfo,
    setUtxos,
    setFees,
    setFee,
    setFeeLoading,
    setZeroFee,
    setCurrencyBalance,
    feeType,
  } = useSendStore()

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    if (Number(amount) > 0 && !isFeeLoading && !warning) {
      onGetFee()

      if (wallet?.symbol === 'xvg') {
        onGetVergeUtxos()
      }
    }
  }, [debounced])

  React.useEffect(() => {
    if (currencyInfo && wallet) {
      if (checkWithOutputs(currencyInfo.symbol, wallet.chain)) {
        onGetOutputs()
      } else {
        setUtxos([])
        setOutputs([])
      }
    }
  }, [currencyInfo, wallet])

  React.useEffect(() => {
    onGetFee()
  }, [wallet])

  const onGetVergeUtxos = (): void => {
    setUtxos(getVergeUtxos(outputs, amount))
  }

  const getDecimals = (): number | undefined => {
    if (wallet) {
      const { symbol, decimals } = wallet

      if (currencyInfo?.tokenChain) {
        return getToken(symbol, currencyInfo.tokenChain)?.decimals || decimals
      }

      return decimals
    }

    return undefined
  }

  const onGetFee = async (): Promise<void> => {
    setFees(fees)
    setFee(0)

    if (Number(amount) > 0 && !isFeeLoading && !warning && wallet && currencyInfo) {
      setFeeLoading(true)

      const { symbol, address, contractAddress } = wallet

      const data = await getNetworkFee({
        symbol,
        amount,
        from: address,
        chain: currencyInfo.chain,
        outputs,
        addressFrom: address,
        tokenChain: currencyInfo?.tokenChain,
        contractAddress,
        decimals: getDecimals(),
      })

      setFeeLoading(false)

      if (data?.isZeroFee) {
        setFee(0)
        setZeroFee(true)
      }

      if (data?.networkFee) {
        setFee(data.networkFee)
      }

      if (data?.utxos?.length) {
        setUtxos(data.utxos)
      }

      if (typeof data?.currencyBalance !== 'undefined') {
        setCurrencyBalance(data.currencyBalance)
      }

      if (data?.fees?.length) {
        setFees(data.fees)

        const findFee = data.fees.find((feeItem: TFee) => feeItem.type === feeType)

        if (findFee?.utxos) {
          setUtxos(findFee.utxos)
        }

        setFee(findFee?.value || data.fees[0].value)
      }
    }
  }

  const onGetOutputs = async (): Promise<void> => {
    if (wallet && currencyInfo) {
      const outputs = await getOutputs(
        wallet.address,
        currencyInfo.chain,
        wallet.chain === 'cardano' ? wallet.contractAddress : undefined
      )

      if (outputs.length) {
        setOutputs(outputs)
      }
    }
  }

  const onValueChange = ({ value }: NumberFormatValues): void => {
    if (inputType === 'amount') {
      setAmount(value)
      setUsdAmount(coinPrice === 0 ? '0' : `${multiplied(coinPrice, value)}`)
    } else {
      setAmount(coinPrice === 0 ? '0' : div(value, coinPrice))
      setUsdAmount(value)
    }
  }

  const onSendMax = (): void => {
    if (openFrom !== 'browser') {
      setAmount(balance)
      setUsdAmount(`${multiplied(coinPrice, balance)}`)
    }
  }

  const onChangeInputType = (): void => {
    if (openFrom !== 'browser') {
      setInputType(inputType === 'amount' ? 'estimated' : 'amount')
    }
  }

  const getValue = (): string => {
    const formatAmount = `${Number(amount)} ${toUpper(wallet?.symbol)}`
    const formatEstimated = `$ ${price(multiplied(coinPrice, amount || '0'))}`

    return inputType === 'amount' ? formatEstimated : formatAmount
  }

  return (
    <Styles.Container>
      <Styles.Row>
        <Styles.Button onClick={onSendMax} isDisabled={openFrom === 'browser'}>
          <Styles.ButtonLabel>MAX</Styles.ButtonLabel>
        </Styles.Button>
        <Styles.AmountRow>
          <Styles.Input
            placeholder={`0 ${toUpper(wallet?.symbol)}`}
            value={inputType === 'amount' ? amount : usdAmount}
            onValueChange={onValueChange}
            thousandSeparator
            allowLeadingZeros
            prefix={inputType === 'estimated' ? '$ ' : undefined}
            suffix={inputType === 'amount' ? ` ${toUpper(wallet?.symbol)}` : undefined}
            disabled={openFrom === 'browser'}
          />
          <Styles.Estimated>{getValue()}</Styles.Estimated>
        </Styles.AmountRow>
        <Styles.Button onClick={onChangeInputType} isDisabled={openFrom === 'browser'}>
          <SVG src={sendShuffleArrowsIcon} width={24} height={24} />
        </Styles.Button>
      </Styles.Row>
      <FeeButton />
      <Warning />
    </Styles.Container>
  )
}

export default observer(SendForm)
