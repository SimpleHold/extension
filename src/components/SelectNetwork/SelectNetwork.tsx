import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Config
import { getCurrency } from '@config/currencies'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

interface Props {
  platform: 'eth' | 'bsc'
  list: string[]
  onSelect: Function
}

const SelectNetwork: React.FC<Props> = (props) => {
  const { platform, list, onSelect } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const currency = getCurrency(platform)

  return (
    <Styles.Wrapper ref={ref} isVisible={isVisible}>
      <Styles.Container onClick={() => setIsVisible(!isVisible)} isVisible={isVisible}>
        <CurrencyLogo symbol={platform} width={40} height={40} br={20} background="#1D1D22" />
        <Styles.Row>
          <Styles.Info>
            <Styles.Label>Select network</Styles.Label>
            {currency ? <Styles.CurrencyName>{currency.name}</Styles.CurrencyName> : null}
          </Styles.Info>
          <Styles.ArrowIconRow>
            <SVG src="../../assets/icons/arrow.svg" width={8} height={14} title="Select network" />
          </Styles.ArrowIconRow>
        </Styles.Row>
      </Styles.Container>

      <Styles.NetworksList isVisible={isVisible}>
        {list.map((item: string) => (
          <Styles.ListItem key={item} onClick={() => onSelect(item)}>
            <Styles.ListItemLabel>{item}</Styles.ListItemLabel>
          </Styles.ListItem>
        ))}
      </Styles.NetworksList>
    </Styles.Wrapper>
  )
}

export default SelectNetwork
