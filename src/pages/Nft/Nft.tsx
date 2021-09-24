import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

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
  image: string
  traits?: TTrait[]
}

const NftPage: React.FC = () => {
  const history = useHistory()
  const {
    state: { tokenId, name, smartContract, chain, image, traits },
  } = useLocation<ILocationState>()

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Wallet" />
      <Styles.Container>
        <Styles.Title>
          {name} {tokenId}
        </Styles.Title>
        <Styles.SubTitle>{name}</Styles.SubTitle>

        <Styles.ContractInfo>
          <Styles.ContractLabel>Smart Contract:</Styles.ContractLabel>
          <Styles.ContractLink>{smartContract}</Styles.ContractLink>
        </Styles.ContractInfo>

        <Styles.Art src={image} alt="art" />

        {traits?.length ? (
          <Styles.Traits>
            {traits.map((trait: TTrait) => {
              const { trait_type, value } = trait

              return (
                <Styles.Trait key={trait_type}>
                  <Styles.TraitType>{trait_type}</Styles.TraitType>
                  <Styles.TraitValue>{value}</Styles.TraitValue>
                </Styles.Trait>
              )
            })}
          </Styles.Traits>
        ) : null}
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default NftPage
