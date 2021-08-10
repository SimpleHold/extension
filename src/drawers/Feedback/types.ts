export interface IProps {
  onClose: () => void
  isActive: boolean
}

export interface IState {
  rating: number
  feedback: string
  isLoading: boolean
  isSent: boolean
}
