import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import CollapsibleHeader from '@components/CollapsibleHeader'
import WalletCard from '@components/WalletCard'

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
  const { scrollPosition } = useScroll()

  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [totalBalance, setTotalBalance] = React.useState<number | null>(null)
  const [totalEstimated, setTotalEstimated] = React.useState<number | null>(null)
  const [walletsBalance, setWalletsBalance] = React.useState<number[]>([])
  const [walletsEstimated, setWalletsEstimated] = React.useState<number[]>([])

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
    }
  }

  const onAddNewAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS,
    })

    history.push('/new-wallet')
  }

  const sumBalance = (amount: number) => {
    setWalletsBalance((prevArray: number[]) => [...prevArray, amount])
  }

  const sumEstimated = (amount: number) => {
    setWalletsEstimated((prevArray: number[]) => [...prevArray, amount])
  }

  return (
    <Styles.Wrapper>
      <CollapsibleHeader
        scrollPosition={scrollPosition}
        totalBalance={totalBalance}
        totalEstimated={totalEstimated}
        onAddNewAddress={onAddNewAddress}
      />
      {wallets?.length ? (
        <Styles.WalletsList style={{ zIndex: scrollPosition > 200 ? 1 : 3 }}>
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
    </Styles.Wrapper>
  )
}

export default Wallets
