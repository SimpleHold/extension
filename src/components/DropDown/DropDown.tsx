import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

export type TDropdowbList = {
  icon: {
    source: string
    width: number
    height: number
  }
  title: string
}

interface Props {
  isVisible: boolean
  dropDownRef: React.RefObject<HTMLDivElement>
  list: TDropdowbList[]
  onClick: (index: number) => void
}

const DropDown: React.FC<Props> = (props) => {
  const { isVisible, dropDownRef, list, onClick } = props

  return (
    <Styles.Container isVisible={isVisible} ref={dropDownRef}>
      {list.map((item: TDropdowbList, index: number) => {
        const { icon, title } = item

        return (
          <Styles.ListItem key={title} onClick={() => onClick(index)}>
            <Styles.IconRow>
              <SVG src={icon.source} width={icon.width} height={icon.height} title="icon" />
            </Styles.IconRow>
            <Styles.Title>{title}</Styles.Title>
          </Styles.ListItem>
        )
      })}
    </Styles.Container>
  )
}

export default DropDown
