import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import NftCard from '@components/NftCard'

// Drawers
import NftFilterDrawer from '@drawers/NftFilter'

// Utils
import { getNft } from '@utils/api'
import { IWallet, getWallets } from '@utils/wallet'

// Types
import { TNft } from '@utils/api/types'
import { ICurrency } from '@config/currencies'

// Styles
import Styles from './styles'

const NftCollectionPage: React.FC = () => {
  const history = useHistory()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'filters'>(null)
  const [collection, setCollection] = React.useState<null | TNft[]>(null)
  const [wallets, setWallets] = React.useState<IWallet[]>([])

  React.useEffect(() => {
    getWalletsList()
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
        (wallet: IWallet) => wallet.symbol === 'eth' || wallet.symbol === 'bnb'
      )

      if (filterWallet.length) {
        setWallets(filterWallet)
        return
      }
    }

    setCollection([])
  }

  const onGetNft = async (): Promise<void> => {
    const mapWallets = wallets.map((wallet: IWallet) => {
      return {
        address: wallet.address,
        chain: wallet.symbol === 'bnb' ? 'bsc' : 'eth',
      }
    })

    const data = await getNft(mapWallets)

    setCollection(data)
  }

  const onViewNft = (item: TNft) => (): void => {
    history.push('/nft', item)
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const openFilters = (): void => {
    setActiveDrawer('filters')
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

  const renderContent = () => (
    <Styles.Content>
      {collection?.map((item: TNft) => {
        const { tokenId, name, contractAddress, chain, image } = item

        return (
          <NftCard
            data={{
              tokenId,
              name,
              contractAddress,
              chain,
              image,
            }}
          />
        )
      })}
    </Styles.Content>
  )

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header />
        <Styles.Tabs>
          <Styles.Nav>
            <Styles.Link onClick={history.goBack}>Wallets</Styles.Link>
            <Styles.LinkDivider>/</Styles.LinkDivider>
            <Styles.Link isActive>Collectibles</Styles.Link>
          </Styles.Nav>
          {wallets.length > 0 ? (
            <Styles.Button onClick={openFilters}>
              <SVG src="../../assets/icons/sort.svg" width={18} height={14} />
            </Styles.Button>
          ) : null}
        </Styles.Tabs>
        <Styles.Container>
          {collection === null ? (
            renderLoading()
          ) : (
            <>{collection.length > 0 ? renderContent() : renderNotFound()}</>
          )}
        </Styles.Container>
      </Styles.Wrapper>
      <NftFilterDrawer isActive={activeDrawer === 'filters'} onClose={onCloseDrawer} />
    </>
  )
}

export default NftCollectionPage
