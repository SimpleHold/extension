import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import timesIcon from '@assets/icons/times.svg'

// Styles
import Styles from './styles'

interface Handles {
  show: (data: string) => void
}

const Notification: React.ForwardRefRenderFunction<Handles, {}> = (props, forwardedRef) => {
  const [text, setText] = React.useState<string>('')

  React.useImperativeHandle(forwardedRef, () => ({
    show(data: string) {
      setText(data)
    },
  }))

  const onClose = (): void => {
    setText('')
  }

  if (text.length) {
    return (
      <Styles.Wrapper>
        <Styles.Text>{text}</Styles.Text>
        <Styles.CloseIcon onClick={onClose}>
          <SVG src={timesIcon} width={10} height={10} title="Close" />
        </Styles.CloseIcon>
      </Styles.Wrapper>
    )
  }

  return null
}

export default React.forwardRef(Notification)
