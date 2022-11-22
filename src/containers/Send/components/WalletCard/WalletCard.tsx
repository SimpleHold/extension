import * as React from 'react'
import { observer } from 'mobx-react-lite'
import numeral from 'numeral'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { short, numberFriendly, getFormatEstimated } from '@utils/format'
import { getWalletName } from '@utils/wallet'
import { getSingleBalance } from '@coins/utils'
import { getToken } from '@tokens/index'
import { minusString } from '@utils/bn'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'

// Styles
import Styles from './styles'

const WalletCard: React.FC = () => {
  const [walletBalance, setWalletBalance] = React.useState<string>('')
  const [walletEstimated, setWalletEstimated] = React.useState<number | null>(null)

  const {
    wallet,
    setActiveDrawer,
    drawerWallets,
    setBalance,
    setBalanceLoading,
    isBalanceLoading,
  } = useSendStore()

  React.useEffect(() => {
    if (wallet) {
      onGetBalance()
    }
  }, [wallet])

  const onGetBalance = async (): Promise<void> => {
    if (wallet) {
      setBalanceLoading(true)

      const { address, symbol, chain, contractAddress } = wallet

      const getCurrency = chain ? getToken(symbol, chain) : getCurrencyInfo(symbol)

      const data = await getSingleBalance({
        symbol,
        address,
        chain: getCurrency?.chain,
        tokenSymbol: chain ? symbol : undefined,
        contractAddress,
        isFullBalance: true,
      })

      checkWalletBalance(`${data.balance}`)
      setWalletBalance(`${data.balance}`)
      setWalletEstimated(data.balance_usd)
      setBalanceLoading(false)
    }
  }

  const checkWalletBalance = (value: string): void => {
    if (!wallet) {
      return
    }

    const { symbol } = wallet

    if (symbol === 'xlm') {
      setBalance(minusString(value, 1.00001))
    } else if (symbol === 'xrp' && Number(value) > 20) {
      setBalance(minusString(value, 20))
    } else {
      setBalance(value)
    }
  }

  const onViewWallets = (): void => {
    if (drawerWallets.length > 1) {
      setActiveDrawer('wallets')
    }
  }

  if (wallet) {
    return (
      <Styles.Container
        className={drawerWallets.length > 1 ? 'active' : ''}
        onClick={onViewWallets}
      >
        <CurrencyLogo
          size={40}
          br={16}
          symbol={wallet.symbol}
          chain={wallet.chain}
          name={wallet.name}
        />
        <Styles.Row>
          <Styles.Left>
            <Styles.Name>{getWalletName(wallet)}</Styles.Name>
            <Styles.Address>{short(wallet.address, 15)}</Styles.Address>
          </Styles.Left>
          <Styles.Right>
            <Skeleton width={120} height={19} type="gray" br={4} isLoading={isBalanceLoading}>
              <Styles.BalanceRow>
                <Styles.Balance>{numeral(walletBalance).format('0.[000000]')}</Styles.Balance>
                <Styles.Symbol>{wallet.symbol}</Styles.Symbol>
              </Styles.BalanceRow>
            </Skeleton>
            <Skeleton width={60} height={20} type="gray" br={4} mt={5} isLoading={isBalanceLoading}>
              <Styles.Estimated>{`$ ${getFormatEstimated(
                walletEstimated,
                numberFriendly(walletEstimated)
              )}`}</Styles.Estimated>
            </Skeleton>
          </Styles.Right>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default observer(WalletCard)
