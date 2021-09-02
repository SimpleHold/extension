import * as React from 'react'
import SVG from 'react-inlinesvg'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

interface Props {
  title: string
  render: React.ReactElement<any, any> | null
  renderRow?: React.ReactElement<any, any> | null
  maxHeight?: number
  toggle?: (value: boolean) => void
}

const Dropdown: React.FC<Props> = (props) => {
  const { title, render, renderRow, maxHeight, toggle } = props

  const { ref, isVisible, toggle: toggleVisible } = useVisible(false)

  React.useEffect(() => {
    if (toggle) {
      toggle(isVisible)
    }
  }, [isVisible])

  return (
    <Styles.Container ref={ref}>
      <Styles.Heading isVisible={isVisible} onClick={toggleVisible}>
        {renderRow || <Styles.HeadingTitle>{title}</Styles.HeadingTitle>}
        <Styles.ArrowIcon className="arrow">
          <SVG src="../../assets/icons/arrow.svg" width={8} height={14} />
        </Styles.ArrowIcon>
      </Styles.Heading>
      <Styles.Body isVisible={isVisible} maxHeight={maxHeight}>
        {render}
      </Styles.Body>
    </Styles.Container>
  )
}

export default Dropdown
