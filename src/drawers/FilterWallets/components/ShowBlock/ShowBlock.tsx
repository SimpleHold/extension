import * as React from 'react'

// Components
import Switch from '@components/Switch'

// Styles
import Styles from './styles'

interface Props {
  title: string
  count: number
  isActive: boolean
  onToggle: () => void
}

const ShowBlock: React.FC<Props> = (props) => {
  const { title, count, isActive, onToggle } = props

  return (
    <Styles.Container>
      <Styles.Row>
        <Styles.Title>{title}</Styles.Title>
        <Styles.CountBlock isActive={isActive}>
          <Styles.Count>{count}</Styles.Count>
        </Styles.CountBlock>
      </Styles.Row>
      <Styles.SwitchRow>
        <Switch value={isActive} onToggle={onToggle} />
      </Styles.SwitchRow>
    </Styles.Container>
  )
}

export default ShowBlock
