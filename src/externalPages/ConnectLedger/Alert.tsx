import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import warningIcon from '@assets/icons/warning.svg'

// Styles
import Styles from './styles'

interface Props {
  type: 'danger' | 'info'
  text: string
  refetchText: string
  onClick: () => void
}

const Alert: React.FC<Props> = (props) => {
  const { type, text, refetchText, onClick } = props

  return (
    <Styles.Alert type={type} onClick={onClick}>
      <Styles.AlertRow>
        <Styles.AlertIcon>
          <SVG src={warningIcon} width={16} height={16} />
        </Styles.AlertIcon>
        <Styles.AlertText>{text}</Styles.AlertText>
      </Styles.AlertRow>
      <Styles.AlertRefetchText>{refetchText}</Styles.AlertRefetchText>
    </Styles.Alert>
  )
}

export default Alert
