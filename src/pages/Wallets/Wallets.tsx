import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { List, ListRowProps, WindowScroller, ScrollParams } from 'react-virtualized'

// Components
import WalletCard from '@components/WalletCard'
import CollapsibleHeader from '@components/CollapsibleHeader'

// Drawers
import FilterWalletsDrawer from '@drawers/FilterWallets'

// Hooks
import useToastContext from '@hooks/useToastContext'
import useState from '@hooks/useState'

// Utils
import { IWallet, getWallets, sortWallets, filterWallets, getWalletName } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import { setBadgeText, getBadgeText } from '@utils/extension'
import { clear, getItem } from '@utils/storage'

// Config
import { ADD_ADDRESS, FILTERS_WATCH, HISTORY_WATCH } from '@config/events'

// Types
import { ILocationState, IState, TWalletAmountData } from './types'
import { TCurrency } from 'drawers/FilterWallets/types'

// Styles
import Styles from './styles'
import { TNft } from 'utils/api/types'

const initialState: IState = {
  wallets: null,
  totalBalance: null,
  totalEstimated: null,
  pendingBalance: null,
  activeDrawer: null,
  scrollPosition: 0
}

const Wallets: React.FC = () => {
  const history = useHistory()
  const { state: locationState } = useLocation<ILocationState>()
  const { state, updateState } = useState<IState>(initialState)

  const [walletsBalance, setWalletsBalance] = React.useState<TWalletAmountData[]>([])
  const [walletsEstimated, setWalletsEstimated] = React.useState<TWalletAmountData[]>([])
  const [walletsPending, setWalletsPending] = React.useState<TWalletAmountData[]>([])

  const addToast = useToastContext()
  const walletsTop = Math.max(110, 290 - 1.25 * state.scrollPosition)

  React.useEffect(() => {
    getWalletsList()
    checkBadgeText()
  }, [])

  React.useEffect(() => {
    if (
      state.wallets?.length === 0 &&
      state.totalBalance === null &&
      state.totalEstimated === null
    ) {
      updateState({
        totalBalance: 0,
        totalEstimated: 0
      })
    }
  }, [state.wallets, state.totalBalance, state.totalEstimated])

  React.useEffect(() => {
    if (locationState?.status === 'passcodeTurnedOff') {
      addToast('Your passcode is disabled now. You can turn it on in settings.')
    }
  }, [locationState])

  const updateBalance = ( arr: TWalletAmountData[], key: 'totalBalance' | 'totalEstimated' | 'pendingBalance' ) => {
    if (arr.length === state.wallets?.length && state[key] === null) {
      updateState({ [key]: arr.reduce((acc, walletData) => acc + walletData.amount, 0) })
    }
  }

  React.useEffect(() => {
    updateBalance(walletsBalance, "totalBalance")
  }, [walletsBalance, state.totalBalance])

  React.useEffect(() => {
    updateBalance(walletsEstimated, "totalEstimated")
  }, [walletsEstimated, state.totalEstimated])

  React.useEffect(() => {
    updateBalance(walletsPending, "pendingBalance")
  }, [walletsPending, state.pendingBalance])

  React.useEffect(() => {
    if (state.wallets && state.wallets.length && walletsBalance.length && walletsBalance.length >= state.wallets.length) {
      const getFilteredSum = (arr: TWalletAmountData[]) => arr
        .filter(filterBySymbol)
        .reduce((acc, wallet) => acc + wallet.amount, 0)

      updateState({
        totalBalance: getFilteredSum(walletsBalance),
        totalEstimated: getFilteredSum(walletsEstimated),
        pendingBalance: getFilteredSum(walletsPending)
      })
    }
  }, [state.wallets, walletsPending, walletsEstimated, walletsBalance])

  const filterBySymbol = (walletAmount: TWalletAmountData) => {
    const data = getItem('selectedCurrenciesFilter')
    const selected = data ? JSON.parse(data) : null
    return selected ? selected.find((currency: TCurrency) => currency.symbol === walletAmount.symbol) : true
  }

  const checkBadgeText = async () => {
    const text = await getBadgeText()

    if (text?.length) {
      setBadgeText('')
    }
  }

  const getWalletsList = () => {
    updateState({
      wallets: null,
      totalBalance: null,
      totalEstimated: null,
      pendingBalance: null
    })
    const walletsList = getWallets()

    if (walletsList) {
      updateState({ wallets: walletsList.filter(filterWallets).sort(sortWallets) })
    } else {
      clear()
      history.push('/welcome')
    }
  }

  const onAddNewAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS
    })

    history.push('/select-currency')
  }

  const getSum = (setStateCallback: React.Dispatch<React.SetStateAction<TWalletAmountData[]>>) => (wallet: TWalletAmountData) => {
    setStateCallback((prevArray: TWalletAmountData[]) => {
      return prevArray.find((existingWallet) => existingWallet.uuid === wallet.uuid) ? prevArray : [ ...prevArray, wallet ]
    })
  }

  const sumBalance = React.useCallback(getSum(setWalletsBalance), [])
  const sumEstimated = React.useCallback(getSum(setWalletsEstimated), [])
  const sumPending = React.useCallback(getSum(setWalletsPending), [])

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onApplyDrawer = (): void => {
    onCloseDrawer()
    getWalletsList()
  }

  const getNameWallet = (wallet: IWallet): string => {
    if (wallet.walletName) {
      return wallet.walletName
    }

    const walletsList = getWallets()

    if (walletsList) {
      const { symbol, uuid, hardware, chain, name } = wallet
      return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
    }
    return ''
  }

  const onViewTxHistory = React.useCallback((): void => {
    history.push('/tx-history')

    logEvent({
      name: HISTORY_WATCH
    })
  }, [])

  const openFilters = React.useCallback((): void => {
    updateState({ activeDrawer: 'filters' })

    logEvent({
      name: FILTERS_WATCH
    })
  }, [])

  const onViewNFT = React.useCallback((): void => {
    history.push('/nft-collection')
  }, [])

  const renderWallet = ({ index, style, key }: ListRowProps): React.ReactNode => {
    const wallet = state.wallets?.[index]

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
        isNotActivated
      } = wallet

      const walletName = getNameWallet(wallet)

      return (
        <div
          style={{
            ...style,
            ...Styles.ListItem
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
            sumBalance={sumBalance}
            sumEstimated={sumEstimated}
            sumPending={sumPending}
            walletName={walletName}
            uuid={uuid}
            hardware={hardware}
            isNotActivated={isNotActivated}
          />
        </div>
      )
    }

    return null
  }

  const onScroll = ({ scrollTop }: ScrollParams): void => {
    updateState({ scrollPosition: scrollTop < 155 ? scrollTop : 155 })
  }

  return (
    <>
      <Styles.Wrapper>
        <CollapsibleHeader
          scrollPosition={state.scrollPosition}
          balance={state.totalBalance}
          estimated={state.totalEstimated}
          pendingBalance={state.pendingBalance}
          isDrawersActive={state.activeDrawer !== null}
          onViewTxHistory={onViewTxHistory}
          openFilters={openFilters}
          onViewNFT={onViewNFT}
        />
        <Styles.WalletsList style={{ top: walletsTop }}>
          <WindowScroller>
            {({ registerChild }) => (
              <div ref={registerChild}>
                <List
                  onScroll={onScroll}
                  height={600}
                  style={Styles.List}
                  rowCount={state.wallets?.length || 0}
                  rowHeight={86}
                  rowRenderer={renderWallet}
                  width={375}
                  overscanRowCount={50}
                  noRowsRenderer={() => (
                    <Styles.NotFound>
                      Nothing was found for the specified parameters
                    </Styles.NotFound>
                  )}
                />
              </div>
            )}
          </WindowScroller>
          <Styles.AddWalletButton onClick={onAddNewAddress}>
            <SVG src='../../assets/icons/plus.svg' width={14} height={14} title='Add new wallet' />
          </Styles.AddWalletButton>
        </Styles.WalletsList>
      </Styles.Wrapper>
      <FilterWalletsDrawer
        isActive={state.activeDrawer === 'filters'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
    </>
  )
}

export default Wallets
