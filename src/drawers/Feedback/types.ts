export interface IProps {
  onClose: () => void
  isActive: boolean
  openFrom?: string
}

export interface IState {
  rating: number
  feedback: string
  isLoading: boolean
  isSent: boolean
}
