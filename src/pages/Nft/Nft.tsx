import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Drawers
import AddImageDrawer from '@drawers/AddImage'

// Utils
import { getContractUrl } from '@utils/currencies'
import { openWebPage } from '@utils/extension'
import { short } from '@utils/format'

// Assets
import linkIcon from '@assets/icons/link.svg'
import emptyNftImage from '@assets/icons/emptyNftImage.svg'

// Styles
import Styles from './styles'

type TTrait = {
  trait_type: string
  value: string
}

interface ILocationState {
  tokenId: number
  name: string
  smartContract: string
  chain: string
  image?: string
  traits?: TTrait[]
}

const NftPage: React.FC = () => {
  const history = useHistory()
  const {
    state,
    state: { tokenId, name, smartContract, chain, traits },
  } = useLocation<ILocationState>()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'addImage'>(null)
  const [image, setImage] = React.useState<undefined | string>(state.image)

  const onAddImage = (): void => {
    setActiveDrawer('addImage')
  }

  const onViewContact = (): void => {
    openWebPage(getContractUrl(smartContract, chain))
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const updateImage = (newImage: string) => {
    setImage(newImage)
    setActiveDrawer(null)
  }

  const onErrorImageLoad = (): void => {
    setImage(undefined)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Wallet" />
        <Styles.Container>
          <Styles.Title>
            {name} {tokenId}
          </Styles.Title>
          <Styles.SubTitle>{name}</Styles.SubTitle>
          {image ? (
            <Styles.Image src={image} alt="image" onError={onErrorImageLoad} />
          ) : (
            <Styles.EmptyImageRow>
              <Styles.EmptyImage src={emptyNftImage} alt="image" />
            </Styles.EmptyImageRow>
          )}

          {traits?.length ? (
            <Styles.Traits>
              {traits.map((trait: TTrait) => {
                const { trait_type, value } = trait

                return (
                  <Styles.Trait key={trait_type}>
                    <Styles.TraitValue>{`${trait_type}: ${value}`}</Styles.TraitValue>
                  </Styles.Trait>
                )
              })}
            </Styles.Traits>
          ) : null}

          <Styles.ContractBlock>
            <Styles.ContractBlockRow>
              <Styles.ContractBlockLabel>Smart Contract</Styles.ContractBlockLabel>
              <Styles.ContractBlockLink>{short(smartContract, 25)}</Styles.ContractBlockLink>
            </Styles.ContractBlockRow>
            <Styles.ContractButton onClick={onViewContact}>
              <SVG src={linkIcon} width={12} height={12} />
            </Styles.ContractButton>
          </Styles.ContractBlock>

          <Button label="Add image" mt={20} onClick={onAddImage} />
        </Styles.Container>
      </Styles.Wrapper>
      <AddImageDrawer
        isActive={activeDrawer === 'addImage'}
        onClose={onCloseDrawer}
        updateImage={updateImage}
      />
    </>
  )
}

export default NftPage
