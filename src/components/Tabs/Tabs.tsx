import * as React from 'react'

// Styles
import Styles from './styles'

type TTab = {
  title: string
  key: string
  renderItem: React.ReactElement<any, any> | null
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
      <Styles.Tabs>
        {tabs.map((tab: TTab) => {
          const { title, key } = tab
          const isActive = activeTabKey === key

          return (
            <Styles.Tab key={key} onClick={onSelectTab(key)} isActive={isActive}>
              <Styles.TabTitle>{title}</Styles.TabTitle>
            </Styles.Tab>
          )
        })}
      </Styles.Tabs>
      {tabs.find((tab: TTab) => tab.key === activeTabKey)?.renderItem}
    </Styles.Container>
  )
}

export default Tabs
