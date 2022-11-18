import * as React from 'react'
import {
  List as _List,
  ListProps,
  ListRowProps,
  WindowScroller as _WindowScroller,
  WindowScrollerProps,
} from 'react-virtualized'

// Components
import WalletCard from '@components/WalletCard'

// Utils
import { getWalletName, IWallet } from '@utils/wallet'

// Types
import { TWalletAmountData } from '@pages/Wallets/types'

// Styles
import Styles from './styles'

export interface IWalletsList {
  wallets: null | IWallet[]
  onScroll?: (params: any) => void
  sumBalanceCallback?: (wallet: TWalletAmountData) => void
  sumEstimatedCallback?: (wallet: TWalletAmountData) => void
  sumPendingCallback?: (wallet: TWalletAmountData) => void
  handleClick?: () => void
  isRedirect?: string
  showSkeletons?: boolean
}

const WindowScroller = _WindowScroller as unknown as React.FC<WindowScrollerProps>
const List = _List as unknown as React.FC<ListProps>

const WalletsList: React.FC<IWalletsList> = (props) => {
  const {
    wallets,
    sumBalanceCallback,
    sumEstimatedCallback,
    sumPendingCallback,
    onScroll,
    handleClick,
    isRedirect,
  } = props

  const renderWallet = ({ index, style, key }: ListRowProps): React.ReactNode => {
    const wallet = wallets?.[index]

    if (wallet) {
      const {
        address,
        symbol,
        chain,
        name,
        contractAddress,
        decimals,
        isHidden,
        uuid,
        hardware,
        isNotActivated,
      } = wallet

      const walletName = getWalletName(wallet)

      return (
        <div
          style={{
            ...style,
            ...Styles.ListItem,
          }}
          key={key}
        >
          <WalletCard
            key={uuid}
            address={address}
            chain={chain}
            symbol={symbol.toLowerCase()}
            name={name}
            contractAddress={contractAddress}
            decimals={decimals}
            isHidden={isHidden}
            sumBalance={sumBalanceCallback}
            sumEstimated={sumEstimatedCallback}
            sumPending={sumPendingCallback}
            walletName={walletName}
            uuid={uuid}
            hardware={hardware}
            isNotActivated={isNotActivated}
            handleClick={handleClick}
            isRedirect={isRedirect}
            wallet={wallet}
          />
        </div>
      )
    }
    return null
  }

  const getRowCount = () => {
    const length = wallets?.length
    if (!length) return 0
    if (length <= 3) return length
    return Math.max(length + 2, 10)
  }

  return (
    <WindowScroller>
      {({ registerChild }) => {
        return (
          // @ts-ignore
          <div ref={registerChild}>
            <List
              className={'wallets-list'}
              onScroll={onScroll}
              height={600}
              style={Styles.List}
              rowCount={getRowCount()}
              rowHeight={70}
              rowRenderer={renderWallet}
              width={375}
              overscanRowCount={0}
              noRowsRenderer={() => (
                <Styles.NotFound>Nothing was found for the specified parameters</Styles.NotFound>
              )}
            />
          </div>
        )
      }}
    </WindowScroller>
  )
}

export default WalletsList
