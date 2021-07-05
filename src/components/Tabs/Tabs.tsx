import * as React from 'react'

// Styles
import Styles from './styles'

type TTab = {
  title: string
  key: string
}

interface Props {
  tabs: TTab[]
  activeTabKey: string
  onSelectTab: (tabKey: string) => () => void
}

const Tabs: React.FC<Props> = (props) => {
  const { tabs, activeTabKey, onSelectTab } = props

  return (
    <Styles.Container>
      {tabs.map((tab: TTab) => {
        const { title, key } = tab
        const isActive = activeTabKey === key

        return (
          <Styles.Tab key={key} isActive={isActive} onClick={onSelectTab(key)}>
            <Styles.TabTitle>{title}</Styles.TabTitle>
          </Styles.Tab>
        )
      })}
    </Styles.Container>
  )
}

export default Tabs
