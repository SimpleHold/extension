import * as React from 'react'

// Styles
import Styles from './styles'

type List = {
  icon: string
  title: string
}

interface Props {
  isVisible: boolean
  dropDownRef: React.RefObject<HTMLDivElement>
  list: List[]
  onClick: (index: number) => void
}

const DropDown: React.FC<Props> = (props) => {
  const { isVisible, dropDownRef, list, onClick } = props

  return (
    <Styles.Container isVisible={isVisible} ref={dropDownRef}>
      {list.map((item: List, index: number) => {
        const { icon, title } = item

        return (
          <Styles.ListItem key={title} onClick={() => onClick(index)}>
            <Styles.IconRow />
            <Styles.Title>{title}</Styles.Title>
          </Styles.ListItem>
        )
      })}
    </Styles.Container>
  )
}

export default DropDown
