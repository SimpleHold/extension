import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import SearchBar from '@components/SearchBar'
import WalletsList from '@components/WalletsList'

// Utils
import { getWalletName, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  wallets: null | IWallet[]
  onClose: () => void
  isActive: boolean
  isRedirect: string
  onClickItem?: (wallet: IWallet) => void
}

const SelectCurrencyDrawer: React.FC<Props> = ({ isActive, onClose, wallets, isRedirect }) => {
  const [searchValue, setSearchValue] = React.useState<string>('')

  const getFilterWalletsList = wallets?.filter((wallet: IWallet) => {
    if (searchValue.length) {
      const walletName = getWalletName(wallet)
      const findByName = toLower(walletName)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(wallet.symbol)?.indexOf(toLower(searchValue) || '') !== -1
      return findByName || findBySymbol
    }
    return wallet
  })

  return (
    <DrawerWrapper
      title="Select Currency"
      isActive={isActive}
      onClose={onClose}
      height={544}
      padding={'30px 0'}
      withoutDimScreen
      withCloseIcon
    >
      <Styles.Wrapper>
        <Styles.SearchContainer>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder={'Enter wallet name'}
          />
        </Styles.SearchContainer>
        <WalletsList wallets={getFilterWalletsList || []} isRedirect={isRedirect} />
      </Styles.Wrapper>
    </DrawerWrapper>
  )
}

export default SelectCurrencyDrawer
