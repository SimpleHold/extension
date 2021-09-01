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
import { IWallet, getWallets, getWalletChain } from '@utils/wallet'
import { getFullTxHistory } from '@utils/api'

// Styles
import Styles from './styles'

type THistoryItem = {
  symbol: string
  hash: string
  name: string
  amount: number
  estimated: number
}

type TGroup = {
  date: string
  data: THistoryItem[]
}

const TxHistory: React.FC = () => {
  const history = useHistory()

  const [activeDrawer, setActiveFilter] = React.useState<'filters' | null>(null)
  const [txGroups, setTxGroups] = React.useState<TGroup[] | null>(null)
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false)

  React.useEffect(() => {
    getWalletList()
  }, [])

  React.useEffect(() => {
    if (wallets.length && txGroups === null) {
      onGetTxHistory()
    }
  }, [wallets, txGroups])

  const getWalletList = (): void => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      setWallets(walletsList)
    }
  }

  const onGetTxHistory = async (): Promise<void> => {
    const mapWallets = wallets.map((wallet: IWallet) => {
      const { address, chain, symbol, contractAddress } = wallet

      return {
        address,
        chain: getWalletChain(symbol, chain),
        tokenSymbol: chain ? symbol : undefined,
        contractAddress,
      }
    })

    const data = await getFullTxHistory(mapWallets)

    // if (!data.length) {
    //   setIsNotFound(true)
    // }

    setTxGroups([
      {
        date: new Date().toString(),
        data: [
          {
            symbol: 'eth',
            hash: '0xa38b8dc1aab577093da9b60a7cdadcd4d1b1be0f5764d2eab128348eed72c8c4',
            name: 'Bitcoin Wallet',
            amount: 10,
            estimated: 0.001,
          },
          {
            symbol: 'btc',
            hash: '8992be2fb5038724d5ab098540c306cbb222a4baf15086acce9ad62bb167a81a',
            name: 'Bitcoin Wallet',
            amount: 10,
            estimated: 0.001,
          },
          {
            symbol: 'ada',
            hash: '65fa809a52b45748b8795b16ed0e38479562a59d914e5411d507e3633c5f6c27',
            name: 'Bitcoin Wallet',
            amount: 10,
            estimated: 0.001,
          },
        ],
      },
    ])
  }

  const onCloseDrawer = (): void => {
    setActiveFilter(null)
  }

  const openFilters = (): void => {
    setActiveFilter('filters')
  }

  const openTx = (symbol: string, chain: string, hash: string) => (): void => {
    history.push('/tx', {
      symbol,
      chain,
      hash,
    })
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
        {Array(5)
          .fill('loading')
          .map((item: string, index: number) => (
            <Styles.TxList key={`${item}/${index}`}>
              <HistoryItem isLoading />
              {index !== 4 ? <DividerLine /> : null}
            </Styles.TxList>
          ))}
      </Styles.Group>
    </>
  )

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
            </Styles.Button>
          </Styles.Heading>

          {isNotFound ? renderNotFound() : null}
          {txGroups === null && !isNotFound ? renderLoading() : null}
          {txGroups !== null && txGroups.length > 0 ? (
            <>
              {txGroups.map((group: TGroup) => {
                const { date, data } = group

                return (
                  <Styles.Group key={date}>
                    <Styles.GroupDateRow>
                      <Styles.GroupDate>{dayjs(date).format('MMM D')}</Styles.GroupDate>
                    </Styles.GroupDateRow>

                    {data.map((tx: THistoryItem) => {
                      const { symbol, hash, name, amount, estimated } = tx

                      return (
                        <HistoryItem
                          key={hash}
                          data={{
                            symbol,
                            hash,
                            name,
                            amount,
                            estimated,
                            isPending: false, // Fix me
                          }}
                          onClick={openTx(symbol, 'cardano', hash)} // Fix me
                        />
                      )
                    })}
                    <DividerLine />
                  </Styles.Group>
                )
              })}
            </>
          ) : null}
        </Styles.Container>
      </Styles.Wrapper>
      <HistoryFilterDrawer isActive={activeDrawer === 'filters'} onClose={onCloseDrawer} />
    </>
  )
}

export default TxHistory
