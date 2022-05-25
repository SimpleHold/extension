import * as React from 'react'

// Types
import { Props, TTab } from './types'

// Styles
import Styles from './styles'

const Tabs: React.FC<Props> = (props) => {
  const { tabs, activeTabKey, onSelectTab } = props

  return (
    <Styles.Container className={'tabs-container'}>
      <Styles.Tabs className={'tabs'}>
        {tabs.map((tab: TTab) => {
          const { title, key, badge } = tab
          const isActive = activeTabKey === key

          return (
            <Styles.Tab key={key} onClick={onSelectTab(key)} isActive={isActive} className={'tab'}>
              <Styles.TabRow>
                <Styles.TabTitle>{title}</Styles.TabTitle>
                {badge !== undefined ? (
                  <Styles.Badge isActive={isActive}>
                    <Styles.BadgeText>{badge}</Styles.BadgeText>
                  </Styles.Badge>
                ) : null}
              </Styles.TabRow>
            </Styles.Tab>
          )
        })}
      </Styles.Tabs>
      {tabs.find((tab: TTab) => tab.key === activeTabKey)?.renderItem}
    </Styles.Container>
  )
}

export default Tabs
