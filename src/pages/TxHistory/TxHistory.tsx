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
import { IState } from './types'

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

  const onGetTxHistory = async (): Promise<void> => {
    updateState({ txGroups: null })

    const mapWallets: TTxWallet[] = state.wallets.map((wallet: IWallet) => {
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
          const { chain, address, txs, symbol } = item

          return {
            chain,
            address,
            symbol,
            txs,
          }
        })

        const fullTxsInfo = await getFullTxHistoryInfo(mapData)
        saveFullHistory(fullTxsInfo)
      }
    }

    const getSavedHistory = getFullHistory()

    if (getSavedHistory.length) {
      updateState({ txGroups: groupHistory(getFullHistory()) })
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

  const openTx = (symbol: string, chain: string, hash: string) => (): void => {
    history.push('/tx', {
      symbol,
      chain,
      hash,
    })
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
        Your transaction history will be displayed here
      </Styles.EmptyHistoryText>
    </Styles.EmptyHistory>
  )

  const renderLoading = () => (
    <>
      <Styles.Group>
        <Styles.GroupDateRow>
          <Skeleton width={50} height={16} br={5} type="gray" isLoading />
        </Styles.GroupDateRow>
        {Array(7)
          .fill('loading')
          .map((item: string, index: number) => (
            <Styles.TxList key={`${item}/${index}`}>
              <HistoryItem isLoading />
              {index !== 6 ? <DividerLine /> : null}
            </Styles.TxList>
          ))}
      </Styles.Group>
    </>
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

                {data.map((tx: TFullTxInfo) => {
                  const { hash, amount, estimated, chain, isPending, symbol, address } = tx
                  const walletName = getNameWallet(symbol, address)

                  return (
                    <HistoryItem
                      key={hash}
                      data={{
                        symbol,
                        hash,
                        name: walletName,
                        amount,
                        estimated,
                        isPending,
                      }}
                      onClick={openTx(symbol, chain, hash)}
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
        <Header withBack backTitle="Home" onBack={history.goBack} />
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
