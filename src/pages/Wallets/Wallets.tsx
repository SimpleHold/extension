import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import WalletCard from '@components/WalletCard'
import CollapsibleHeader from '@components/CollapsibleHeader'

// Hooks
import useScroll from '@hooks/useScroll'

// Utils
import { IWallet, getWallets } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'

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
  const [walletsPending, setWalletsPending] = React.useState<number[]>([])
  const [pendingBalance, setPendingBalance] = React.useState<null | number>(null)

  const { scrollPosition } = useScroll()

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
    if (walletsPending.length === wallets?.length && pendingBalance === null) {
      setPendingBalance(walletsPending.reduce((a, b) => a + b, 0))
    }
  }, [walletsPending, pendingBalance])

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

  const sumPending = (amount: number) => {
    setWalletsPending((prevArray: number[]) => [...prevArray, amount])
  }

  return (
    <Styles.Wrapper>
      <CollapsibleHeader
        onAddNewAddress={onAddNewAddress}
        scrollPosition={scrollPosition}
        balance={totalBalance}
        estimated={totalEstimated}
        pendingBalance={pendingBalance}
      />
      {wallets?.length ? (
        <Styles.WalletsList>
          {wallets.map((wallet: IWallet, index: number) => {
            const { address, symbol, platform } = wallet

            return (
              <WalletCard
                key={`${address}/${index}`}
                address={address}
                platform={platform}
                symbol={symbol.toLowerCase()}
                sumBalance={sumBalance}
                sumEstimated={sumEstimated}
                sumPending={sumPending}
              />
            )
          })}
        </Styles.WalletsList>
      ) : null}
    </Styles.Wrapper>
  )
}

export default Wallets
