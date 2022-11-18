import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ScrollParams } from 'react-virtualized'
import { useIdleTimer } from 'react-idle-timer'
import browser from 'webextension-polyfill'

// Components
import CollapsibleHeader from '@components/CollapsibleHeader'
import BottomMenuBar from '@components/BottomMenuBar'
import MainListControls from '@components/MainListControls'
import WalletsList from '@components/WalletsList'

// Drawers
import FilterWalletsDrawer from '@drawers/FilterWallets'
import SelectCurrencyDrawer from '@drawers/SelectCurrency'

// Hooks
import useToastContext from '@hooks/useToastContext'
import useState from '@hooks/useState'

// Utils
import { getFilteredSum, getFilteredWallets, getWallets, IWallet } from '@utils/wallet'
import { logEvent } from '@utils/metrics'
import { getBadgeText, openWebPage, setBadgeText } from '@utils/extension'
import { checkOneOfExist, clear, getItem, setItem } from '@utils/storage'
import { getBalances } from '@coins/utils'
import { checkIfTimePassed, toMs } from '@utils/dates'

// Config
import {
  ADD_ADDRESS,
  FILTERS_SELECT,
  HISTORY_SELECT,
  MAIN_HOME,
  RECEIVE_SELECT,
  EXCHANGE_SELECT,
} from '@config/events'

// Types
import { ILocationState, IState, TWalletAmountData } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  wallets: null,
  totalBalance: null,
  totalEstimated: null,
  pendingBalance: null,
  activeDrawer: null,
  scrollPosition: 0,
}

const LS = {
  getItem: async (key: string) => (await browser.storage.local.get(key))[key],
}

const Wallets: React.FC = () => {
  const history = useHistory()
  const { state: locationState } = useLocation<ILocationState>()
  const { state, updateState } = useState<IState>(initialState)

  const [walletsBalance, setWalletsBalance] = React.useState<TWalletAmountData[]>([])
  const [walletsEstimated, setWalletsEstimated] = React.useState<TWalletAmountData[]>([])
  const [walletsPending, setWalletsPending] = React.useState<TWalletAmountData[]>([])

  const [isHeaderCollapsed, setIsHeaderCollapsed] = React.useState(false)
  const [isListScrollable, setIsListScrollable] = React.useState(false)

  const [listType, setListType] = React.useState<'send' | 'receive' | null>(null)
  const [isShowNft, setIsShowNfts] = React.useState(false)

  const [isIdle, setIsIdle] = React.useState(false)

  let refreshBalancesTimerId: number
  const balanceRefreshTime = { minutes: 2 }

  useIdleTimer({
    timeout: toMs({ minutes: 5 }),
    onActive: () => setIsIdle(false),
    onIdle: () => setIsIdle(true),
  })

  const addToast = useToastContext()
  const walletsTop = isHeaderCollapsed ? 120 : 278

  React.useEffect(() => {
    getWalletsList()
    checkBadgeText()
    logEvent({
      name: MAIN_HOME,
    })
    setWalletsToBackground()
    checkWindowStorageTokens()
    return () => clearTimeout(refreshBalancesTimerId)
  }, [])

  React.useEffect(() => {
    if (
      state.wallets?.length === 0 &&
      state.totalBalance === null &&
      state.totalEstimated === null
    ) {
      updateState({
        totalBalance: 0,
        totalEstimated: 0,
      })
    }
  }, [state.wallets, state.totalBalance, state.totalEstimated])

  React.useEffect(() => {
    if (locationState?.status === 'passcodeTurnedOff') {
      addToast('Your passcode is disabled now. You can turn it on in settings.')
    }
  }, [locationState])

  const checkWindowStorageTokens = async (): Promise<void> => {
    const getTokens = await LS.getItem('tokens')

    if (getTokens) {
      setItem('tokens', JSON.stringify(getTokens))
    }
  }

  const updateBalance = (
    arr: TWalletAmountData[],
    type: 'totalBalance' | 'totalEstimated' | 'pendingBalance'
  ) => {
    if (arr.length === state.wallets?.length && state[type] === null) {
      updateState({ [type]: arr.reduce((acc, walletData) => acc + walletData.amount, 0) })
    }
  }

  React.useEffect(() => {
    updateBalance(walletsBalance, 'totalBalance')
  }, [walletsBalance, state.totalBalance])

  React.useEffect(() => {
    updateBalance(walletsEstimated, 'totalEstimated')
  }, [walletsEstimated, state.totalEstimated])

  React.useEffect(() => {
    updateBalance(walletsPending, 'pendingBalance')
  }, [walletsPending, state.pendingBalance])

  React.useEffect(() => {
    if (
      state.wallets &&
      state.wallets.length &&
      walletsBalance.length &&
      walletsBalance.length >= state.wallets.length
    ) {
      calculateBalances()
    }
  }, [state.wallets, walletsPending, walletsEstimated, walletsBalance])

  React.useEffect(() => {
    setTimeout(() => setIsListScrollable(isHeaderCollapsed), 500)
  }, [isHeaderCollapsed])

  React.useEffect(() => {
    toggleScroll(isListScrollable ? 'on' : 'off')
  }, [isListScrollable])

  React.useEffect(() => {
    toggleScroll('off')
  }, [])

  const setWalletsToBackground = (): void => {
    browser.runtime.sendMessage({
      type: 'wallets',
      data: getWallets(),
    })
  }

  const showSelectCurrencyDrawer = () => updateState({ activeDrawer: 'select_currency' })

  const calculateBalances = () => {
    updateState({
      totalBalance: getFilteredSum(walletsBalance),
      pendingBalance: getFilteredSum(walletsPending),
      totalEstimated: getFilteredSum(walletsEstimated),
    })
  }

  const checkBadgeText = async () => {
    const text = await getBadgeText()

    if (text?.length) {
      setBadgeText('')
    }
  }

  const getWalletsList = async () => {
    updateState({
      wallets: null,
      totalBalance: null,
      totalEstimated: null,
      pendingBalance: null,
    })
    let wallets = getFilteredWallets()

    if (wallets.length) {
      updateState({ wallets })
      await loadBalances()
      wallets = getFilteredWallets()
      setInitialBalance(wallets)
    } else {
      clear()
      history.push('/welcome')
    }
  }

  const onAddNewAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS,
    })
    history.push('/select-currency')
  }

  const loadBalances = async () => {
    refreshBalancesTimerId = +setTimeout(loadBalances, toMs(balanceRefreshTime))
    let wallets = getFilteredWallets()
    const lastUpdate = getItem('last_balances_request')
    const isTimePassed = !lastUpdate || checkIfTimePassed(+lastUpdate, balanceRefreshTime)
    const isFetchReady = getItem('initial_balances_request') || (!isIdle && isTimePassed)
    if (isFetchReady) {
      setItem('last_balances_request', String(Date.now()))
      await getBalances(wallets)
    }
  }

  const setInitialBalance = (wallets: IWallet[]) => {
    let walletsBalance: TWalletAmountData[] = []
    let walletsPending: TWalletAmountData[] = []
    let walletsEstimated: TWalletAmountData[] = []
    for (const wallet of wallets) {
      const { balance_btc, balance_usd, pending_btc, symbol, uuid } = wallet
      walletsBalance.push({ symbol, uuid, amount: balance_btc || 0 })
      walletsPending.push({ symbol, uuid, amount: pending_btc || 0 })
      walletsEstimated.push({ symbol, uuid, amount: balance_usd || 0 })
    }
    setWalletsBalance(walletsBalance)
    setWalletsPending(walletsPending)
    setWalletsEstimated(walletsEstimated)
  }

  const sumWalletBalance =
    (setStateCallback: React.Dispatch<React.SetStateAction<TWalletAmountData[]>>) =>
    (wallet: TWalletAmountData) => {
      setStateCallback((prevArray: TWalletAmountData[]) => {
        return prevArray.find((existingWallet) => existingWallet.uuid === wallet.uuid)
          ? prevArray
          : [...prevArray, wallet]
      })
    }

  const sumBalanceCallback = React.useCallback(sumWalletBalance(setWalletsBalance), [])
  const sumEstimatedCallback = React.useCallback(sumWalletBalance(setWalletsEstimated), [])
  const sumPendingCallback = React.useCallback(sumWalletBalance(setWalletsPending), [])

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onApplyDrawer = (): void => {
    onCloseDrawer()
    getWalletsList()
  }

  const onViewTxHistory = React.useCallback((): void => {
    history.push('/tx-history')
    logEvent({
      name: HISTORY_SELECT,
    })
  }, [])

  const openPage = React.useCallback((page: string): void => {
    history.push(page)
  }, [])

  const onClickSwap = (): void => {
    logEvent({
      name: EXCHANGE_SELECT,
    })

    openWebPage('https://simpleswap.io/?ref=2a7607295184')
  }

  const setListOnClickHandler = (type: 'send' | 'receive') => () => {
    if (type === 'receive') {
      logEvent({
        name: RECEIVE_SELECT,
      })
    }
    setListType(type)
    showSelectCurrencyDrawer()
  }

  const openFilters = React.useCallback((): void => {
    updateState({ activeDrawer: 'filters' })

    logEvent({
      name: FILTERS_SELECT,
      properties: {
        type: 'wallets',
      },
    })
  }, [])

  const onViewNFT = React.useCallback((): void => {
    history.push('/nft-collection')
  }, [])

  const onScroll = ({ scrollTop }: ScrollParams): void => {
    updateState({ scrollPosition: scrollTop < 155 ? scrollTop : 155 })
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    const offset = e?.deltaY
    if (offset > 20) {
      setIsHeaderCollapsed(true)
    }
    if (offset < 0 && state.scrollPosition === 0) {
      setIsHeaderCollapsed(false)
      toggleScroll('off')
    }
  }

  const scrollHandler = React.useCallback((e: any) => e.preventDefault(), [])

  const toggleScroll = (toggle: 'on' | 'off') => {
    const list = document.getElementsByClassName('ReactVirtualized__List')[0]
    const events = ['mousewheel', 'touchmove']
    const method = toggle === 'off' ? 'addEventListener' : 'removeEventListener'
    events.forEach((event) => list?.[method](event, scrollHandler, false))
  }

  const isFiltersActive = (): boolean => {
    return checkOneOfExist([
      'selectedCurrenciesFilter',
      'hiddenWalletsFilter',
      'zeroBalancesFilter',
      'activeSortKey',
      'activeSortType',
    ])
  }

  const listControlsProps = {
    onSwitch: () => {
      setIsShowNfts(true)
      onViewNFT()
    },
    isFiltersActive: isFiltersActive(),
    openFilters,
    showNft: isShowNft,
    onAddNewAddress,
  }

  return (
    <>
      <Styles.Wrapper>
        <CollapsibleHeader
          isCollapsed={isHeaderCollapsed}
          balance={state.totalBalance}
          estimated={state.totalEstimated}
          pendingBalance={state.pendingBalance}
          onClickReceive={setListOnClickHandler('receive')}
          onClickSend={setListOnClickHandler('send')}
        />
        <Styles.WalletsListContainer
          style={{ top: walletsTop, zIndex: 2 }}
          isUnfolded={isHeaderCollapsed}
          onWheel={onWheel}
        >
          <MainListControls controlsProps={listControlsProps} isListUnfolded={isHeaderCollapsed} />
          <WalletsList
            wallets={state.wallets}
            onScroll={onScroll}
            sumBalanceCallback={sumBalanceCallback}
            sumEstimatedCallback={sumEstimatedCallback}
            sumPendingCallback={sumPendingCallback}
          />
        </Styles.WalletsListContainer>
      </Styles.Wrapper>
      <FilterWalletsDrawer
        isActive={state.activeDrawer === 'filters'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
      <SelectCurrencyDrawer
        wallets={state.wallets}
        isActive={state.activeDrawer === 'select_currency'}
        onClose={onCloseDrawer}
        isRedirect={`/${listType}`}
      />
      <BottomMenuBar
        onViewTxHistory={onViewTxHistory}
        onOpenSettings={() => openPage('/settings')}
        onClickWallets={() => openPage('/wallets')}
        onClickSwap={onClickSwap}
      />
    </>
  )
}

export default Wallets
