// Types
import { IWallet } from '@utils/wallet'

export interface Props {
  balance: number | null
  symbol?: string
  wallets: IWallet[]
  address: string
  setAddress: (value: string) => void
  addressErrorLabel: string | null
  openWalletsDrawer: () => void
  onGenerateExtraId: () => void
  checkAddress: () => void
  onSendAll: () => void
  extraIdName: string | null
  extraId: string
  setExtraId: (value: string) => void
  amount: string
  setAmount: (value: string) => void
  amountErrorLabel: string | null
  checkAmount: () => void
  amountLabel?: string
  openFrom?: string
  disabled?: boolean
}
