export interface Props {
  onClose: () => void
  isActive: boolean
}

export type TStatuses = 'sended' | 'received' | 'pending'

export type TStatusItem = {
  title: string
  key: TStatuses
}

export type TCurrency = {
  symbol: string
  name: string
  chain?: string
}
