import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import NftCard from '@components/NftCard'
import BottomMenuBar from '@components/BottomMenuBar'
import MenuSwitch from '@components/MenuSwitch'
import FiltersButton from '@components/FiltersButton'

// Drawers
import NftFilterDrawer from '@drawers/NftFilter'

// Utils
import { getNft } from '@utils/api'
import { IWallet, getWallets } from '@utils/wallet'
import { checkOneOfExist, getItem, getNFTImage } from '@utils/storage'
import { toLower } from '@utils/format'
import { logEvent } from '@utils/amplitude'
import { openWebPage } from '@utils/extension'

// Types
import { TNft } from '@utils/api/types'

// Config
import { HISTORY_SELECT, MAIN_SELECT_NFT, EXCHANGE_SELECT, FILTERS_SELECT } from '@config/events'

// Styles
import Styles from './styles'

const NftCollectionPage: React.FC = () => {
  const history = useHistory()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'filters'>(null)
  const [collection, setCollection] = React.useState<null | TNft[]>(null)
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [switchPosition, setSwitchPosition] = React.useState<'wallets' | 'nfts'>('nfts')

  React.useEffect(() => {
    getWalletsList()
    logEvent({
      name: MAIN_SELECT_NFT,
    })
  }, [])

  React.useEffect(() => {
    if (wallets.length) {
      onGetNft()
    }
  }, [wallets])

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const filterWallet = walletsList.filter(
        (wallet: IWallet) =>
          wallet.symbol === 'eth'
          || wallet.symbol === 'bnb'
          || wallet.symbol === 'matic'
          || wallet.symbol === 'sol',
      )

      if (filterWallet.length) {
        setWallets(filterWallet)
        return
      }
    }

    setCollection([])
  }

  const filterWallets = (wallet: IWallet): IWallet | boolean => {
    const getNetwork = getItem('nftFiltersNetwork')
    const getAddresses = getItem('nftFiltersAddresses')
    if (getNetwork && !getAddresses?.length) {
      const formatNetwork = getNetwork === 'bsc' ? 'bnb' : getNetwork
      return toLower(wallet.symbol) === toLower(formatNetwork)
    }

    if (getAddresses?.length) {
      return JSON.parse(getAddresses).find(
        (item: IWallet) =>
          toLower(item.symbol) === toLower(wallet.symbol) &&
          toLower(item.address) === toLower(wallet.address),
      )
    }

    return wallet
  }

  const prepareData = (data: TNft[]): TNft[] => {
    for (const item of data) {
      const { contractAddress, chain, tokenId } = item
      const getImage = getNFTImage(contractAddress, chain, tokenId)

      if (getImage) {
        item.image = getImage
      }
    }

    return data
  }

  const getChainFromSymbol = (symbol: string): string => {
    if (symbol === 'bnb') {
      return 'bsc'
    }
    return symbol
  }

  const onGetNft = async (): Promise<void> => {
    const mapWallets = wallets.filter(filterWallets).map((wallet: IWallet) => {
      return {
        address: wallet.address,
        chain: getChainFromSymbol(wallet.symbol),
      }
    })

    const data = await getNft(mapWallets)

    setCollection(prepareData(data))
  }

  const onViewNft = (item: TNft) => (): void => {
    history.push('/nft', item)
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const openFilters = (): void => {
    logEvent({
      name: FILTERS_SELECT,
      properties: {
        type: "nfts"
      }
    })
    setActiveDrawer('filters')
  }

  const onViewTxHistory = React.useCallback((): void => {
    history.push('/tx-history')
    logEvent({
      name: HISTORY_SELECT,
    })
  }, [])

  const openPage = React.useCallback((page: string): void => {
    history.push(page)
  }, [])

  const onClickSwap = (): void => {
    logEvent({
      name: EXCHANGE_SELECT,
    })

    openWebPage('https://simpleswap.io/?ref=2a7607295184')
  }


  const renderNotFound = () => (
    <Styles.NotFound>
      <Styles.NotFoundIcon />
      <Styles.NotFoundText>No NFTs to show, your NFTs will show up here</Styles.NotFoundText>
    </Styles.NotFound>
  )

  const renderLoading = () => (
    <Styles.Loading>
      {Array(4)
        .fill('loading')
        .map((i: string, index: number) => (
          <NftCard key={`${i}/${index}`} isLoading />
        ))}
    </Styles.Loading>
  )

  const onViewWallets = React.useCallback((): void => {
    history.push('/wallets')
  }, [])

  const onSwitch = () => {
    setSwitchPosition('wallets')
    onViewWallets()
  }

  const renderContent = () => (
    <Styles.Content>
      {collection?.map((item: TNft) => {
        const { tokenId, name, contractAddress, chain, image } = item

        return (
          <NftCard
            key={(tokenId + name).slice(0, 10)}
            data={{
              tokenId,
              name,
              contractAddress,
              chain,
              image,
            }}
            onView={onViewNft(item)}
          />
        )
      })}
    </Styles.Content>
  )

  const onApplyDrawer = (): void => {
    onCloseDrawer()
    onGetNft()
  }

  const isFiltersActive = (): boolean => {
    return checkOneOfExist(['nftFiltersNetwork', 'nftFiltersAddresses'])
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header whiteLogo withBack isHomePage />
        <Styles.Container>
          <Styles.Controls>
            <MenuSwitch isRightPosition={switchPosition === 'nfts'} onSwitch={onSwitch} />
            {wallets.length > 0 ? (
              <FiltersButton isFiltersActive={isFiltersActive()} onClick={openFilters} />
            ) : null}
          </Styles.Controls>
          {collection === null ? (
            renderLoading()
          ) : (
            <>{collection.length > 0 ? renderContent() : renderNotFound()}</>
          )}
        </Styles.Container>
      </Styles.Wrapper>
      <NftFilterDrawer
        isActive={activeDrawer === 'filters'}
        onClose={onCloseDrawer}
        onApply={onApplyDrawer}
      />
      <BottomMenuBar onViewTxHistory={onViewTxHistory}
                     onOpenSettings={() => openPage('/settings')}
                     onClickWallets={() => openPage('/wallets')}
                     onClickSwap={onClickSwap}
      />
    </>
  )
}

export default NftCollectionPage
