import * as React from 'react'
import { observer } from 'mobx-react-lite'

// Components
import LightHeader from '@components/LightHeader'
import SendProgress from '@containers/Send/components/SendProgress'
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import FilledWarning from '@components/FilledWarning'

// Utils
import { toLower } from '@utils/format'
import { fetchBalances, getEstimated } from '@utils/api'
import { minus, minusString, plus } from '@utils/bn'

// Store
import { useSendStore } from '@store/send/store'

// Coins
import {
  validateAddress,
  checkIsMemoRequired,
  getExtraIdName,
  generateExtraId,
  isGenerateExtraId,
} from '@coins/index'

// Config
import { checkEmptyBalances, warnings } from './data'

// Styles
import Styles from './styles'

interface Props {
  onBack: () => void
  onNext: () => void
  setActiveDrawer: (value: 'wallets' | null) => void
  setFeeEstimated: (value: number) => void
  amount: string
  setAmount: (amount: string) => void
  memo: string
  setMemo: (amount: string) => void
  address: string
  setAddress: (amount: string) => void
}

const EnterAddressContainer: React.FC<Props> = (props) => {
  const {
    onBack,
    setActiveDrawer,
    setFeeEstimated,
    amount,
    setAmount,
    memo,
    setMemo,
    address,
    setAddress,
  } = props

  const [isButtonLoading, setButtonLoading] = React.useState<boolean>(false)
  const [warning, setWarning] = React.useState<null | string>(null)
  const [isButtonDisabled, setButtonDisabled] = React.useState<boolean>(false)

  const { wallet, currencyInfo, drawerWallets, feeSymbol, balance, fee } = useSendStore()

  React.useEffect(() => {
    getFeeEstimated()
  }, [feeSymbol])

  React.useEffect(() => {
    if (warning) {
      setWarning(null)
      setButtonDisabled(false)
    }
  }, [address])

  const withMemoRequired =
    wallet !== null && checkIsMemoRequired(wallet.symbol) && !memo.length ? true : false
  const isAddressInvalid =
    wallet &&
    currencyInfo &&
    !validateAddress(wallet.symbol, address, currencyInfo.chain, currencyInfo.tokenChain)
      ? 'Address is not valid'
      : null
  const addressSameSender =
    wallet && toLower(wallet.address) === toLower(address) ? 'Address same as sender' : null

  const isNextDisabled =
    !address.length ||
    !wallet ||
    !currencyInfo ||
    !validateAddress(wallet.symbol, address, currencyInfo.chain, currencyInfo.tokenChain) ||
    withMemoRequired ||
    addressSameSender !== null
  const extraIdName = wallet && getExtraIdName(wallet.symbol)

  const renderInputButton = (inputType: 'address' | 'extraId') => {
    if (inputType === 'address' && drawerWallets.length > 1) {
      return {
        label: 'To my wallet',
        onClick: () => {
          setActiveDrawer('wallets')
        },
      }
    }

    if (inputType === 'extraId' && wallet && isGenerateExtraId(wallet.symbol)) {
      return {
        label: 'Generate',
        onClick: onGenerateExtraId,
      }
    }

    return undefined
  }

  const onGenerateExtraId = (): void => {
    if (wallet) {
      const newMemo = generateExtraId(wallet.symbol)

      if (newMemo) {
        setMemo(newMemo)
      }
    }
  }

  const getFeeEstimated = async (): Promise<void> => {
    const request = await getEstimated(1, feeSymbol, 'usd')

    setFeeEstimated(request)
  }

  const checkRecipient = async (): Promise<void> => {
    if (wallet) {
      const findItem = checkEmptyBalances.find((i) => i.symbol === wallet.symbol)

      if (findItem && Number(amount) < findItem.minAmount && !wallet.chain) {
        const { chain, warning } = findItem

        setButtonLoading(true)

        const getRecipientBalance = await fetchBalances([
          {
            address,
            chain,
          },
        ])

        setButtonLoading(false)

        if (getRecipientBalance?.[0]?.balanceInfo?.balance === 0) {
          setButtonDisabled(true)
          setWarning(warning)
          return
        }
      } else if (!wallet.chain && wallet.symbol === 'vtho') {
        const safeGap = fee * 2
        const isInsufficientBalance = Number(balance) - safeGap <= 0.001

        if (isInsufficientBalance) {
          const minValue = (balance + safeGap).toString().slice(0, 6)

          setButtonDisabled(true)
          setWarning(`Min amount for this transfer is ${minValue}`)

          return
        }
        if (amount + safeGap >= balance) {
          setAmount(minusString(amount, fee))
        }
      }
    }

    return await onNext(true)
  }

  const onNext = async (skipCheck?: boolean): Promise<void> => {
    if (!skipCheck) {
      return await checkRecipient()
    }

    props.onNext()
  }

  const getWarnings = (): React.ReactNode => {
    if (wallet?.symbol === 'dot' && !wallet.chain) {
      const total = minus(balance, plus(amount, fee))

      if (total < 1 && total !== 0) {
        return <FilledWarning text={warnings.dot} mt={20} />
      }
    }

    return null
  }

  return (
    <Styles.Container>
      <LightHeader title="Send to" onBack={onBack} />
      <Styles.Row>
        <Styles.Top>
          <SendProgress step="enterAddress" />
          <TextInput
            label="Enter Recipient Address"
            value={address}
            onChange={setAddress}
            type="text"
            errorLabel={isAddressInvalid || addressSameSender}
            renderButton={renderInputButton('address')}
          />
          {extraIdName ? (
            <TextInput
              label={`Enter ${extraIdName} (optional)`}
              value={memo}
              onChange={setMemo}
              type="text"
              renderButton={renderInputButton('extraId')}
            />
          ) : null}
          {warning ? <FilledWarning text={warning} mt={20} /> : null}
          {getWarnings()}
        </Styles.Top>
        <Button
          label="Next"
          onClick={onNext}
          disabled={isNextDisabled || isButtonDisabled}
          isLoading={isButtonLoading}
        />
      </Styles.Row>
    </Styles.Container>
  )
}

export default observer(EnterAddressContainer)
