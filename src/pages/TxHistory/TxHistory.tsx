import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import dayjs from 'dayjs'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import DividerLine from '@components/DividerLine'
import HistoryItem from './components/Item'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'

// Drawers
import HistoryFilterDrawer from '@drawers/HistoryFilter'

// Utils
import { IWallet, getWallets, getWalletChain, getWalletName } from '@utils/wallet'
import { getFullTxHistory, getFullTxHistoryInfo } from '@utils/api'
import { groupHistory, THistoryTxGroup } from '@utils/txs'
import { toLower } from '@utils/format'
import { checkOneOfExist, getItem } from '@utils/storage'
import { compareFullHistory, saveFullHistory, getFullHistory } from '@utils/txs'

// Hooks
import useState from '@hooks/useState'

// Types
import { TTxAddressItem, TFullTxWallet, TFullTxInfo, TTxWallet } from '@utils/api/types'
import { IState, TTxData } from './types'
import { TCurrency } from '@drawers/HistoryFilter/types'

// Styles
import Styles from './styles'

const initialState: IState = {
  activeDrawer: null,
  txGroups: null,
  wallets: [],
  isNotFound: false,
}

const TxHistory: React.FC = () => {
  const history = useHistory()

  const { state, updateState } = useState(initialState)

  React.useEffect(() => {
    getWalletList()
  }, [])

  React.useEffect(() => {
    if (state.wallets.length && state.txGroups === null) {
      onGetTxHistory()
    }
  }, [state.wallets, state.txGroups])

  const getWalletList = (): void => {
    const wallets = getWallets()

    if (wallets?.length) {
      updateState({ wallets })
    }
  }

  const filterWallets = (wallet: IWallet): IWallet => {
    const getCurrencies = getItem('txHistoryCurrencies')
    const getAddresses = getItem('txHistoryAddresses')

    if (getCurrencies?.length && !getAddresses) {
      return JSON.parse(getCurrencies).find(
        (currency: TCurrency) => toLower(currency.symbol) === toLower(wallet.symbol)
      )
    }

    if (getAddresses?.length) {
      return JSON.parse(getAddresses).find(
        (item: IWallet) =>
          toLower(item.symbol) === toLower(wallet.symbol) &&
          toLower(item.address) === toLower(wallet.address)
      )
    }

    return wallet
  }

  const onGetTxHistory = async (): Promise<void> => {
    updateState({ txGroups: null, isNotFound: false })

    const getFilteredWallets = state.wallets.filter(filterWallets)
    const mapWallets: TTxWallet[] = getFilteredWallets.map((wallet: IWallet) => {
      const { address, chain, symbol, contractAddress } = wallet

      return {
        address,
        chain: getWalletChain(symbol, chain),
        symbol,
        tokenSymbol: chain ? symbol : undefined,
        contractAddress,
      }
    })
    const data = await getFullTxHistory(mapWallets)
    if (data.length) {
      const compare = compareFullHistory(data)

      if (compare.length) {
        const mapData: TFullTxWallet[] = data.map((item: TTxAddressItem) => {
          const { chain, address, txs, symbol, tokenSymbol, contractAddress } = item

          return {
            chain,
            address,
            symbol,
            txs,
            tokenSymbol,
            contractAddress,
          }
        })
        const fullTxsInfo = await getFullTxHistoryInfo(mapData)
        saveFullHistory(fullTxsInfo)
      }
    }

    const getSavedHistory = getFullHistory()
    if (getSavedHistory.length) {
      updateState({ txGroups: groupHistory(getSavedHistory) })
    } else {
      updateState({ isNotFound: true })
    }
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const openFilters = (): void => {
    updateState({ activeDrawer: 'filters' })
  }

  const openTx = (data: TTxData) => (): void => {
    history.push('/tx', data)
  }

  const getNameWallet = (symbol: string, address: string): string => {
    const walletsList = getWallets()

    if (walletsList) {
      const findWallet = walletsList.find(
        (wallet: IWallet) =>
          toLower(wallet.symbol) === toLower(symbol) && toLower(wallet.address) === toLower(address)
      )

      if (findWallet) {
        const { symbol, uuid, hardware, chain, name, walletName } = findWallet

        if (walletName) {
          return walletName
        }

        return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
      }
    }

    return ''
  }

  const renderNotFound = () => (
    <Styles.EmptyHistory>
      <Styles.EmptyHistoryIcon />
      <Styles.EmptyHistoryText>
        {isFiltersActive()
          ? 'We couldn’t find anything matching selected criteria'
          : 'You have no transactions yet, but new ones will appear here'}
      </Styles.EmptyHistoryText>
    </Styles.EmptyHistory>
  )

  const renderLoading = () => (
    <Styles.Loading>
      <Styles.Group>
        <Styles.GroupDateRow>
          <Skeleton width={50} height={16} br={5} type="gray" isLoading />
        </Styles.GroupDateRow>
        {Array(7)
          .fill('loading')
          .map((item: string, index: number) => (
            <div key={`${item}/${index}`}>
              <HistoryItem isLoading />
              {index !== 6 ? <DividerLine /> : null}
            </div>
          ))}
      </Styles.Group>
      <Styles.LoadingBackground>
        <Styles.LoadingImageRow>
          <Styles.LoadingImage>
            <Spinner size={18} />
          </Styles.LoadingImage>
        </Styles.LoadingImageRow>

        <Styles.LoadingText>Please wait, we’re uploading data</Styles.LoadingText>
      </Styles.LoadingBackground>
    </Styles.Loading>
  )

  const renderHistory = () => {
    if (state.txGroups != null) {
      return (
        <Styles.TxList>
          {state.txGroups?.map((group: THistoryTxGroup, index: number) => {
            const { date, data } = group

            return (
              <Styles.Group key={date}>
                <Styles.GroupDateRow>
                  <Styles.GroupDate>{dayjs(date).format('MMM D')}</Styles.GroupDate>
                </Styles.GroupDateRow>

                {data.map((tx: TFullTxInfo, index: number) => {
                  const {
                    hash,
                    amount,
                    estimated,
                    chain,
                    isPending,
                    symbol,
                    address,
                    tokenSymbol,
                    contractAddress,
                    date,
                  } = tx
                  const walletName = getNameWallet(symbol, address)
                  const tokenChain = tokenSymbol ? chain : undefined

                  return (
                    <HistoryItem
                      key={`${hash}/${date}/${amount}/${index}`}
                      data={{
                        symbol,
                        hash,
                        name: walletName,
                        amount,
                        estimated,
                        isPending,
                        tokenChain,
                      }}
                      onClick={openTx({
                        symbol,
                        address,
                        chain,
                        hash,
                        tokenChain,
                        tokenSymbol,
                        contractAddress,
                      })}
                    />
                  )
                })}
                {state.txGroups !== null && index !== state.txGroups.length - 1 ? (
                  <DividerLine />
                ) : null}
              </Styles.Group>
            )
          })}
        </Styles.TxList>
      )
    }

    return null
  }

  const isFiltersActive = (): boolean => {
    return checkOneOfExist(['txHistoryStatus', 'txHistoryCurrencies', 'txHistoryAddresses'])
  }

  const onApplyDrawer = (): void => {
    onCloseDrawer()
    onGetTxHistory()
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Home" onBack={history.goBack} whiteLogo />
        <Styles.Container>
          <Styles.Heading>
            <Styles.Title>History</Styles.Title>
            <Styles.Button onClick={openFilters}>
              <SVG src="../../assets/icons/sort.svg" width={18} height={14} />
              {isFiltersActive() ? <Styles.ButtonDot /> : null}
            </Styles.Button>
          </Styles.Heading>
          {state.isNotFound ? renderNotFound() : null}
          {state.txGroups === null && !state.isNotFound ? renderLoading() : null}
          {state.txGroups !== null && state.txGroups.length > 0 && !state.isNotFound
            ? renderHistory()
            : null}
        </Styles.Container>
      </Styles.Wrapper>
      <HistoryFilterDrawer
        isActive={state.activeDrawer === 'filters'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
    </>
  )
}

export default TxHistory
