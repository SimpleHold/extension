import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import CheckBox from '@components/CheckBox'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  name: string
  isActive: boolean
  onToggle: () => void
  chain?: string
}

const Currency: React.FC<Props> = (props) => {
  const { symbol, name, isActive, onToggle, chain } = props

  return (
    <Styles.Container onClick={onToggle}>
      <CurrencyLogo size={40} br={13} symbol={symbol} chain={chain} />
      <Styles.Row>
        <Styles.Name>{name}</Styles.Name>
        <Styles.CheckBoxRow>
          <CheckBox value={isActive} size={16} onClick={onToggle} borderSize={2} />
        </Styles.CheckBoxRow>
      </Styles.Row>
    </Styles.Container>
  )
}

export default Currency
