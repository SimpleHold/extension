import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  name: string
  tokenId: number
  image?: string
  onView: () => void
}

const NftCard: React.FC<Props> = (props) => {
  const { name, tokenId, image, onView } = props

  return (
    <Styles.Container onClick={onView}>
      <Styles.Row>
        {image ? <Styles.Image src={image} alt="image" /> : null}
        <Styles.Body>
          <Styles.Name>{name}</Styles.Name>
          <Styles.TokenId>{tokenId}</Styles.TokenId>
        </Styles.Body>
      </Styles.Row>
    </Styles.Container>
  )
}

export default NftCard
