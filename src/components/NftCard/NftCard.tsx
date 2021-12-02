import * as React from 'react'

// Components
import Skeleton from '@components/Skeleton'

// Utils
import { short } from '@utils/format'

// Assets
import emptyNftImage from '@assets/icons/emptyNftImage.svg'

// Styles
import Styles from './styles'

interface Props {
  isLoading?: boolean
  data?: {
    tokenId: number
    name: string
    contractAddress: string
    chain: string
    image?: string
  }
  onView?: () => void
}

const NftCard: React.FC<Props> = (props) => {
  const { isLoading, data, onView } = props

  const [image, setImage] = React.useState<undefined | string>(data?.image)

  const onErrorImageLoad = (): void => {
    setImage(undefined)
  }

  if (isLoading) {
    return (
      <Styles.Container>
        <Styles.SkeletonRow>
          <Styles.SkeletonImage />
          <Styles.Body>
            <Skeleton width={120} height={19} type="gray" isLoading />
            <Skeleton width={80} height={16} mt={4} type="gray" isLoading />
          </Styles.Body>
        </Styles.SkeletonRow>
      </Styles.Container>
    )
  }

  if (data) {
    const { tokenId, name } = data

    return (
      <Styles.Container onClick={onView}>
        <Styles.Row>
          {image ? (
            <Styles.Image src={image} alt="image" onError={onErrorImageLoad} />
          ) : (
            <Styles.EmptyImageRow>
              <Styles.EmptyImage src={emptyNftImage} alt="image" />
            </Styles.EmptyImageRow>
          )}
          <Styles.Body className="card-body">
            <Styles.Name className="card-name">{name}</Styles.Name>
            <Styles.TokenId>{short(`${tokenId}`, 8)}</Styles.TokenId>
          </Styles.Body>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default NftCard
