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
  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false)

  React.useEffect(() => {
    onGetTxHistory()
  }, [])

  const onGetTxHistory = async (): Promise<void> => {
    setTimeout(() => {
      setTxGroups([
        {
          date: new Date().toString(),
          data: [
            {
              symbol: 'btc',
              hash: '1ef718814a52ccb046c6976606b2858e57817d13600e4c42d56f04b8f849686b',
              name: 'Bitcoin Wallet',
              amount: 10,
              estimated: 0.001,
            },
          ],
        },
      ])
    }, 2000)
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

          {txGroups?.length === 0 ? renderNotFound() : null}
          {txGroups === null ? renderLoading() : null}

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
                          onClick={openTx(symbol, 'bitcoin', hash)} // Fix me
                        />
                      )
                    })}
                    <DividerLine />
                  </Styles.Group>
                )
              })}
            </>
          ) : null}

          {isLoadingMore ? (
            <Styles.SpinnerRow>
              <Spinner size={16} />
            </Styles.SpinnerRow>
          ) : null}
        </Styles.Container>
      </Styles.Wrapper>
      <HistoryFilterDrawer isActive={activeDrawer === 'filters'} onClose={onCloseDrawer} />
    </>
  )
}

export default TxHistory
