export type TBlockInfo = {
  block_account: string
  amount: string
  balance: string
  height: string
  local_timestamp: string
  confirmed: string
  contents: {
    type: string
    account: string
    previous: string
    representative: string
    balance: string
    link: string
    link_as_account: string
    signature: string
    work: string
  }
  subtype: string
  successor?: string
}

export type TAccountInfo = {
  account_version: string
  balance: string
  block_count: string
  confirmation_height: string
  confirmation_height_frontier: string
  frontier: string
  modified_timestamp: string
  open_block: string
  representative: string
  representative_block: string
}


export type TReceiveBlock = {
  address: string
  pubKey: string
  privKey: string
  blockHash: string
  walletActivation?: {
    representative: string
  }
}

export type TActivateData = {
  hash: string
  representative: string
}

export type TReceivableResponse = {
  blocks: string[]
}

export type TProcessBlock = {
  hash: string
}

export type TRpcRequest = <T>() => Promise<T | null>

export type TQueueRequest = {
  request: TRpcRequest
  resolver: any //
}

export type TRequestHandler = {
  _queue: TQueueRequest[]
  _inProgress: boolean
  add(request: TQueueRequest): void
  run(): void
}