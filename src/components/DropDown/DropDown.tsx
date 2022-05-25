import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

export type TDropdownList = {
  icon: {
    source: string
    width: number
    height: number
  }
  title: string
  key: string
}

interface Props {
  isVisible: boolean
  dropDownRef: React.RefObject<HTMLDivElement>
  list: TDropdownList[]
  onClick: (key: string) => void
}

const DropDown: React.FC<Props> = (props) => {
  const { isVisible, dropDownRef, list, onClick } = props

  const onClickItem = (key: string) => (): void => {
    onClick(key)
  }

  return (
    <Styles.Container isVisible={isVisible} ref={dropDownRef}>
      {list.map((item: TDropdownList) => {
        const { icon, title, key } = item

        return (
          <Styles.ListItem key={key} onClick={onClickItem(key)}>
            <Styles.IconRow>
              <SVG src={icon.source} width={icon.width} height={icon.height} />
            </Styles.IconRow>
            <Styles.Title>{title}</Styles.Title>
          </Styles.ListItem>
        )
      })}
    </Styles.Container>
  )
}

export default DropDown
