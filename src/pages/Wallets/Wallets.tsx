import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import WalletCard from '@components/WalletCard'
import CollapsibleHeader from '@components/CollapsibleHeader'

// Drawers
import SortWalletsDrawer from '@drawers/SortWallets'
import FilterWalletsDrawer from '@drawers/FilterWallets'

// Hooks
import useScroll from '@hooks/useScroll'
import useToastContext from '@hooks/useToastContext'

// Utils
import { IWallet, getWallets, sortWallets } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import { setBadgeText, getBadgeText } from '@utils/extension'

// Config
import { ADD_ADDRESS, BALANCE_CHANGED } from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  status?: string
}

const Wallets: React.FC = () => {
  const history = useHistory()
  const { state } = useLocation<LocationState>()

  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [totalBalance, setTotalBalance] = React.useState<number | null>(null)
  const [totalEstimated, setTotalEstimated] = React.useState<number | null>(null)
  const [walletsBalance, setWalletsBalance] = React.useState<number[]>([])
  const [walletsEstimated, setWalletsEstimated] = React.useState<number[]>([])
  const [walletsPending, setWalletsPending] = React.useState<number[]>([])
  const [pendingBalance, setPendingBalance] = React.useState<null | number>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<'sort' | 'filters' | null>(null)

  const { scrollPosition } = useScroll()
  const addToast = useToastContext()

  React.useEffect(() => {
    getWalletsList()
    checkBadgeText()
  }, [])

  React.useEffect(() => {
    if (state?.status === 'passcodeTurnedOff') {
      addToast('Your passcode is disabled now. You can turn it on in settings.')
    }
  }, [state])

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
        if (b.balance_btc) {
          return a + b.balance_btc
        }
        return 0
      }, 0)

      if (getLatesTotalBalance !== totalBalance) {
        logEvent({
          name: BALANCE_CHANGED,
        })
      }
    }
  }, [totalBalance, totalEstimated])

  const checkBadgeText = async () => {
    const text = await getBadgeText()

    if (text?.length) {
      setBadgeText('')
    }
  }

  const getWalletsList = () => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList.sort(sortWallets))
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

  const onSortWallets = (): void => {
    setActiveDrawer('sort')
  }

  const onFilterWallets = (): void => {
    setActiveDrawer('filters')
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onApplyDrawer = (): void => {
    onCloseDrawer()
    getWalletsList()
  }

  return (
    <>
      <Styles.Wrapper>
        <CollapsibleHeader
          scrollPosition={scrollPosition}
          balance={totalBalance}
          estimated={totalEstimated}
          pendingBalance={pendingBalance}
          onSortWallets={onSortWallets}
          onFilterWallets={onFilterWallets}
        />
        {wallets?.length ? (
          <Styles.WalletsList>
            {wallets.map((wallet: IWallet, index: number) => {
              const { address, symbol, chain, name, contractAddress, decimals, isHidden } = wallet

              return (
                <WalletCard
                  key={`${address}/${index}`}
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
                />
              )
            })}
            <Styles.AddWalletButton onClick={onAddNewAddress}>
              <SVG
                src="../../assets/icons/plus.svg"
                width={14}
                height={14}
                title="Add new wallet"
              />
            </Styles.AddWalletButton>
          </Styles.WalletsList>
        ) : null}
      </Styles.Wrapper>
      <SortWalletsDrawer
        isActive={activeDrawer === 'sort'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
      <FilterWalletsDrawer
        isActive={activeDrawer === 'filters'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
    </>
  )
}

export default Wallets
