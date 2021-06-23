import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CopyToClipboard from '@components/CopyToClipboard'
import Button from '@components/Button'

// Utils
import { generateExtraId } from '@utils/address'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  title: string
  symbol: string
}

const ExtraIdDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, title, symbol } = props

  const [extraId, setExtraId] = React.useState<string>('')

  React.useEffect(() => {
    if (isActive) {
      const generate = generateExtraId(symbol)

      if (generate) {
        setExtraId(generate)
      }
    }
  }, [isActive])

  return (
    <DrawerWrapper title={title} isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <CopyToClipboard value={extraId}>
          <Styles.ExtraId>{extraId}</Styles.ExtraId>
        </CopyToClipboard>

        <Styles.Actions>
          <Button label="Done" onClick={onClose} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ExtraIdDrawer
