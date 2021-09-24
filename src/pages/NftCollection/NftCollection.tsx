import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import NftCard from '@components/NftCard'

// Utils
import { getNft } from '@utils/api'

// Types
import { TNft } from '@utils/api/types'
import { ICurrency } from '@config/currencies'

// Styles
import Styles from './styles'

export interface ILocationState {
  address: string
  currency: ICurrency
}

const NftCollectionPage: React.FC = () => {
  const history = useHistory()
  const {
    state: { address, currency },
  } = useLocation<ILocationState>()

  const [collection, setCollection] = React.useState<null | TNft[]>(null)

  React.useEffect(() => {
    onGetNft()
  }, [])

  const onGetNft = async (): Promise<void> => {
    const data = await getNft(address, currency.chain)

    setCollection(data)
  }

  const onViewNft = (item: TNft) => (): void => {
    history.push('/nft', item)
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Wallet" />
      <Styles.Container>
        <Styles.Title>My NFT Collection</Styles.Title>
        {collection?.length ? (
          <Styles.List>
            {collection.map((item: TNft, index: number) => {
              const { name, tokenId, image } = item

              return (
                <NftCard
                  key={`${name}/${index}`}
                  name={name}
                  tokenId={tokenId}
                  image={image}
                  onView={onViewNft(item)}
                />
              )
            })}
          </Styles.List>
        ) : null}
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default NftCollectionPage
