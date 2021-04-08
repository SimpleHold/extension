import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

type TList = {
  logo: {
    symbol: string
    width: number
    height: number
    br: number
    background?: string
  }
  value: string
}

interface Props {
  currencySymbol: string
  list: TList[]
  onSelect: Function
  label: string
  value: string
  disabled?: boolean
}

const SelectNetwork: React.FC<Props> = (props) => {
  const { currencySymbol, list, onSelect, label, value, disabled } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  return (
    <Styles.Wrapper ref={ref} isVisible={isVisible}>
      <Styles.Container
        onClick={() => (disabled ? null : setIsVisible(!isVisible))}
        isVisible={isVisible}
        disabled={disabled}
      >
        <CurrencyLogo symbol={currencySymbol} width={40} height={40} br={20} background="#1D1D22" />
        <Styles.Row>
          <Styles.Info>
            <Styles.Label>{label}</Styles.Label>
            <Styles.Value>{value}</Styles.Value>
          </Styles.Info>
          {!disabled ? (
            <Styles.ArrowIconRow>
              <SVG
                src="../../assets/icons/arrow.svg"
                width={8}
                height={14}
                title="Select network"
              />
            </Styles.ArrowIconRow>
          ) : null}
        </Styles.Row>
      </Styles.Container>

      {!disabled ? (
        <Styles.NetworksList isVisible={isVisible}>
          {list.map((item: TList) => {
            const { logo, value } = item

            return (
              <Styles.ListItem key={value} onClick={() => onSelect(value)}>
                <CurrencyLogo
                  symbol={logo.symbol}
                  width={logo.width}
                  height={logo.height}
                  br={logo.br}
                  background={logo.background}
                />
                <Styles.ListItemLabel>{value}</Styles.ListItemLabel>
              </Styles.ListItem>
            )
          })}
        </Styles.NetworksList>
      ) : null}
    </Styles.Wrapper>
  )
}

export default SelectNetwork
