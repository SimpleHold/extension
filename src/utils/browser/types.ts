export interface IRequest {
  type: string
  data?: any
  detail?: any
}

export type TPopupPosition = {
  top: number
  left: number
}

export type TResponse<D> = {
  error: boolean
  data: D
}
