import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { getCurrencyByChain } from '@config/currencies'

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
    chain?: string
  }
  value: string
  label?: string
}

interface Props {
  currencySymbol?: string
  list: TList[]
  onSelect: Function
  label?: string
  value?: string
  disabled?: boolean
  currencyBr: number
  background?: string
  tokenChain?: string
  tokenName?: string
}

const CurrenciesDropdown: React.FC<Props> = (props) => {
  const {
    currencySymbol,
    list,
    onSelect,
    label,
    value,
    disabled,
    currencyBr,
    background,
    tokenChain,
    tokenName,
  } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const getTokenBackground =
    tokenChain && tokenName ? getCurrencyByChain(tokenChain)?.background : '#1D1D22'

  const onSelectItem = (index: number): void => {
    onSelect(index)
    setIsVisible(false)
  }

  return (
    <Styles.Wrapper ref={ref} isVisible={isVisible}>
      <Styles.Container
        onClick={() => (disabled ? null : setIsVisible(!isVisible))}
        isVisible={isVisible}
        disabled={disabled}
        isNotSelected={!currencySymbol && !value}
      >
        {currencySymbol ? (
          <CurrencyLogo
            symbol={currencySymbol}
            width={40}
            height={40}
            br={currencyBr}
            background={background || getTokenBackground}
            chain={tokenChain}
            name={tokenName}
          />
        ) : null}
        <Styles.Row isNotSelected={!currencySymbol && !value}>
          <Styles.Info>
            {label?.length ? (
              <Styles.Label isNotSelected={!currencySymbol && !value}>{label}</Styles.Label>
            ) : null}
            {value?.length ? <Styles.Value>{value}</Styles.Value> : null}
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
          {list.map((item: TList, index: number) => {
            const { logo, value, label } = item

            return (
              <Styles.ListItem key={value} onClick={() => onSelectItem(index)}>
                <CurrencyLogo
                  symbol={logo.symbol}
                  width={logo.width}
                  height={logo.height}
                  br={logo.br}
                  background={logo.background}
                  chain={logo?.chain}
                  name={tokenName}
                />
                <Styles.ListItemRow>
                  <Styles.ListItemLabel>{label}</Styles.ListItemLabel>
                  <Styles.ListItemValue>{value}</Styles.ListItemValue>
                </Styles.ListItemRow>
              </Styles.ListItem>
            )
          })}
        </Styles.NetworksList>
      ) : null}
    </Styles.Wrapper>
  )
}

export default CurrenciesDropdown
