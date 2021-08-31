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
}

const Dropdown: React.FC<Props> = (props) => {
  const { title, render, renderRow } = props

  const { ref, isVisible, toggle } = useVisible(false)

  return (
    <Styles.Container ref={ref}>
      <Styles.Heading isVisible={isVisible} onClick={toggle}>
        {renderRow || <Styles.HeadingTitle>{title}</Styles.HeadingTitle>}
        <Styles.ArrowIcon className="arrow">
          <SVG src="../../assets/icons/arrow.svg" width={8} height={14} />
        </Styles.ArrowIcon>
      </Styles.Heading>
      <Styles.Body isVisible={isVisible}>{render}</Styles.Body>
    </Styles.Container>
  )
}

export default Dropdown
