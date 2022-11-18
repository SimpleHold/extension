import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import questionIcon from '@assets/icons/question.svg'
import collapsibleCloseIcon from '@assets/icons/collapsibleClose.svg'

// Styles
import Styles from './styles'

interface Props {
  title: string
  text: string
}

const Collapsible: React.FC<Props> = (props) => {
  const { title, text } = props

  const [bodyHeight, setBodyHeight] = React.useState<number>(0)
  const [isActive, setActive] = React.useState<boolean>(false)

  const bodyRef = React.useRef<HTMLParagraphElement>(null)

  const onClick = (): void => {
    setBodyHeight(bodyRef.current?.clientHeight || 0)

    setActive((prev: boolean) => !prev)
  }

  return (
    <Styles.Container>
      <Styles.Heading onClick={onClick}>
        <Styles.Title>{title}</Styles.Title>
        <Styles.HeadingIconRow>
          <SVG src={isActive ? collapsibleCloseIcon : questionIcon} width={24} height={24} />
        </Styles.HeadingIconRow>
      </Styles.Heading>
      <Styles.Body isActive={isActive} bodyHeight={bodyHeight}>
        <Styles.Text ref={bodyRef}>{text}</Styles.Text>
      </Styles.Body>
    </Styles.Container>
  )
}

export default Collapsible
