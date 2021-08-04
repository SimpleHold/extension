import * as React from 'react'
import copy from 'copy-to-clipboard'

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
  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  React.useEffect(() => {
    if (isActive) {
      const generate = generateExtraId(symbol)

      if (generate) {
        setExtraId(generate)
      }
    }
  }, [isActive])

  const onCopy = (): void => {
    copy(extraId)
  }

  return (
    <DrawerWrapper title={title} isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <CopyToClipboard value={extraId}>
          <Styles.ExtraId>{extraId}</Styles.ExtraId>
        </CopyToClipboard>

        <Styles.Actions>
          <Button label={isCopied ? 'Copied!' : 'Copy'} onClick={onCopy} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ExtraIdDrawer
