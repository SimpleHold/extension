import * as React from 'react'

// Components
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import WalletCard from '../WalletCard'
import FeeButton from '../FeeButton'
import Spinner from '@components/Spinner'

// Utils
import { toUpper } from '@utils/format'
import { IWallet, THardware } from '@utils/wallet'
import { getNetworkFeeSymbol } from '@utils/address'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  onCancel: () => void
  balance: null | number
  estimated: null | number
  walletName: string
  address: string
  hardware?: THardware
  chain?: string
  name?: string
  openWalletsDrawer: () => void
  wallets: IWallet[]
  selectedAddress: string
  changeWallet: (address: string, name: string, hardware?: THardware) => void
  destination: {
    value: string
    onChange: (value: string) => void
  }
}

const SendForm: React.FC<Props> = (props) => {
  const {
    symbol,
    onCancel,
    balance,
    estimated,
    walletName,
    address,
    hardware,
    chain,
    name,
    openWalletsDrawer,
    wallets,
    selectedAddress,
    changeWallet,
    destination,
  } = props

  const [amount, setAmount] = React.useState<string>('')
  const [feeType, setFeeType] = React.useState<'Slow' | 'Average' | 'Fast'>('Average')
  const [fee, setFee] = React.useState<number>(0)
  const [feeSymbol, setFeeSymbol] = React.useState<string>('')
  const [isFeeLoading, setFeeLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    getFeeSymbol()
  }, [])

  const getFeeSymbol = (): void => {
    setFeeSymbol(getNetworkFeeSymbol(symbol, chain))
  }

  const onConfirm = (): void => {}

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Styles.Container>
      <Styles.Form onSubmit={onSubmitForm}>
        <WalletCard
          balance={balance}
          estimated={estimated}
          symbol={symbol}
          hardware={hardware}
          walletName={walletName}
          address={address}
          chain={chain}
          name={name}
          wallets={wallets}
          selectedAddress={selectedAddress}
          changeWallet={changeWallet}
        />
        <Styles.FormRow>
          <TextInput
            label="Recipient Address"
            value={destination.value}
            onChange={destination.onChange}
          />
          <TextInput label={`Amount (${toUpper(symbol)})`} value={amount} onChange={setAmount} />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeRow>
              <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
              {isFeeLoading ? (
                <Spinner size={16} />
              ) : (
                <Styles.NetworkFee>
                  {fee === 0 ? '-' : `${fee} ${toUpper(feeSymbol)}`}
                </Styles.NetworkFee>
              )}
            </Styles.NetworkFeeRow>
            <FeeButton type={feeType} onChange={setFeeType} />
          </Styles.NetworkFeeBlock>
        </Styles.FormRow>
      </Styles.Form>
      <Styles.Actions>
        <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
        <Button label="Send" disabled onClick={onConfirm} ml={7.5} />
      </Styles.Actions>
    </Styles.Container>
  )
}

export default SendForm
