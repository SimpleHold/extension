import * as React from 'react'
import copy from 'copy-to-clipboard'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactNode
  value: string
  mb?: number
}

const CopyToClipboard: React.FC<Props> = (props) => {
  const { children, value, mb } = props

  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  const onCopy = (): void => {
    copy(value)
    setIsCopied(true)
  }

  const onMouseLeave = (): void => {
    if (isCopied) {
      setIsCopied(false)
    }
  }

  return (
    <Styles.Container onMouseLeave={onMouseLeave} mb={mb}>
      <Styles.Row onClick={onCopy}>{children}</Styles.Row>
      <Styles.Tooltip>
        <Styles.TooltipText>{isCopied ? 'Copied!' : 'Сopy to clipboard'}</Styles.TooltipText>
      </Styles.Tooltip>
    </Styles.Container>
  )
}

export default CopyToClipboard
