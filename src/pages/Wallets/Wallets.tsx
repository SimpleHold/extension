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
import { IWallet, getWallets, sortWallets, filterWallets, getWalletName } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import { setBadgeText, getBadgeText } from '@utils/extension'
import { clear } from '@utils/storage'

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
    if (wallets?.length === 0 && totalBalance === null && totalEstimated === null) {
      setTotalBalance(0)
      setTotalEstimated(0)
    }
  }, [wallets, totalBalance, totalEstimated])

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
    setWallets(null)

    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList.filter(filterWallets).sort(sortWallets))
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

  const sumBalance = (amount: number) => {
    setWalletsBalance((prevArray: number[]) => [...prevArray, amount])
  }

  const sumEstimated = (amount: number) => {
    setWalletsEstimated((prevArray: number[]) => [...prevArray, amount])
  }

  const sumPending = (amount: number) => {
    setWalletsPending((prevArray: number[]) => [...prevArray, amount])
  }

  const onShowDrawer = (drawerType: 'sort' | 'filters'): void => {
    setActiveDrawer(drawerType)
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
          onShowDrawer={onShowDrawer}
          isDrawersActive={activeDrawer !== null}
        />
        {wallets !== null ? (
          <Styles.WalletsList>
            {wallets?.length
              ? wallets.map((wallet: IWallet) => {
                  const {
                    address,
                    symbol,
                    chain,
                    name,
                    contractAddress,
                    decimals,
                    isHidden,
                    uuid,
                  } = wallet

                  const walletName =
                    wallet.walletName || getWalletName(wallets, symbol, uuid, chain, name)

                  return (
                    <WalletCard
                      key={`${symbol}/${address}/${chain}`}
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
                    />
                  )
                })
              : null}
            {wallets.length === 0 ? (
              <Styles.NotFound>Nothing was found for the specified parameters</Styles.NotFound>
            ) : null}
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
