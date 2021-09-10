import * as React from 'react'
import copy from 'copy-to-clipboard'

// Components
import Tooltip from '@components/Tooltip'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactElement<any, any> | null
  value: string
  onCopy?: () => void
  zIndex?: number
}

const CopyToClipboard: React.FC<Props> = (props) => {
  const { children, value, onCopy: onCopySuccess, zIndex } = props

  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  const onCopy = (): void => {
    if (onCopySuccess) {
      onCopySuccess()
    }

    copy(value)
    setIsCopied(true)
  }

  const onMouseLeave = (): void => {
    if (isCopied) {
      setIsCopied(false)
    }
  }

  return (
    <Tooltip text={isCopied ? 'Copied!' : 'Сopy to clipboard'} zIndex={zIndex}>
      <Styles.Container onMouseLeave={onMouseLeave}>
        <Styles.Row onClick={onCopy}>{children}</Styles.Row>
      </Styles.Container>
    </Tooltip>
  )
}

export default CopyToClipboard
