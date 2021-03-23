import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Header from '@components/Header'
import WalletCard from '@components/WalletCard'
import Skeleton from '@components/Skeleton'
import PendingBalance from '@components/PendingBalance'

// Utils
import { IWallet, getWallets } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import { price } from '@utils/format'

// Config
import { ADD_ADDRESS, BALANCE_CHANGED } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()
  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [totalBalance, setTotalBalance] = React.useState<number | null>(null)
  const [totalEstimated, setTotalEstimated] = React.useState<number | null>(null)
  const [walletsBalance, setWalletsBalance] = React.useState<number[]>([])
  const [walletsEstimated, setWalletsEstimated] = React.useState<number[]>([])
  const [unconfirmedBalance, setUnconfirmedBalance] = React.useState<null | number>(1)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    if (walletsBalance.length === wallets?.length && totalBalance === null) {
      setTotalBalance(walletsBalance.reduce((a, b) => a + b, 0))
    }
  }, [walletsBalance, totalBalance])

  React.useEffect(() => {
    if (walletsEstimated.length === wallets?.length && totalEstimated === null) {
      setTotalEstimated(walletsEstimated.reduce((a, b) => a + b, 0))
    }
  }, [walletsEstimated, totalEstimated])

  React.useEffect(() => {
    if (totalBalance !== null && totalEstimated !== null) {
      const getLatesTotalBalance = wallets?.reduce((a, b) => {
        if (b.balance) {
          return a + b.balance
        }
        return 0
      }, 0)

      if (getLatesTotalBalance !== totalBalance) {
        logEvent({
          name: BALANCE_CHANGED,
        })
      }
    }
  }, [totalBalance])

  const getWalletsList = () => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList)
    } else {
      localStorage.clear()
      history.push('/welcome')
    }
  }

  const onAddNewAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS,
    })

    history.push('/select-currency')
  }

  const sumBalance = (amount: number) => {
    setWalletsBalance((prevArray: number[]) => [...prevArray, amount])
  }

  const sumEstimated = (amount: number) => {
    setWalletsEstimated((prevArray: number[]) => [...prevArray, amount])
  }

  return (
    <Styles.Wrapper>
      <Styles.Row>
        <Styles.Cover>
          <Header />

          <Styles.Balances>
            <Styles.TotalBalanceLabel>Total Balance</Styles.TotalBalanceLabel>
            <Skeleton
              width={250}
              height={42}
              type="light"
              mt={21}
              isLoading={totalBalance === null}
            >
              <Styles.TotalBalance>
                {numeral(totalBalance).format('0.[00000000]')} BTC
              </Styles.TotalBalance>
            </Skeleton>
            <Skeleton
              width={130}
              height={23}
              type="light"
              mt={5}
              isLoading={totalEstimated === null}
              mb={10}
            >
              <Styles.TotalEstimated>{`$${price(totalEstimated)} USD`}</Styles.TotalEstimated>
            </Skeleton>
            {unconfirmedBalance !== null && unconfirmedBalance > 0 ? (
              <PendingBalance btcValue={unconfirmedBalance} type="light" />
            ) : null}
          </Styles.Balances>

          <Styles.AddWalletBlock>
            <Styles.WalletsLabel>Wallets</Styles.WalletsLabel>
            <Styles.AddWalletButton onClick={onAddNewAddress}>
              <SVG
                src="../../assets/icons/plus.svg"
                width={16}
                height={16}
                title="Add new wallet"
              />
            </Styles.AddWalletButton>
          </Styles.AddWalletBlock>
        </Styles.Cover>
        {wallets?.length ? (
          <Styles.WalletsList>
            {wallets.map((wallet: IWallet) => {
              const { address, symbol } = wallet

              return (
                <WalletCard
                  key={address}
                  address={address}
                  symbol={symbol.toLowerCase()}
                  sumBalance={sumBalance}
                  sumEstimated={sumEstimated}
                />
              )
            })}
          </Styles.WalletsList>
        ) : null}
      </Styles.Row>
    </Styles.Wrapper>
  )
}

export default Wallets
