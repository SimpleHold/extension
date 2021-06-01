import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Utils
import { getCurrencyByChain } from '@config/currencies'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

export type TList = {
  logo?: {
    symbol: string
    width: number
    height: number
    br: number
    background?: string
    chain?: string
    name?: string
  }
  value: string
  label?: string
  withRadioButton?: boolean
}

interface Props {
  currencySymbol?: string
  list: TList[]
  onSelect?: (index: number) => void
  label?: string
  value?: string
  disabled?: boolean
  currencyBr?: number
  background?: string
  tokenChain?: string
  tokenName?: string
  toggleRadioButton?: (value: string) => void
  radioButtonValues?: string[]
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
    toggleRadioButton,
    radioButtonValues,
  } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const getTokenBackground =
    tokenChain && tokenName ? getCurrencyByChain(tokenChain)?.background : '#1D1D22'

  const onSelectItem = (index: number): void => {
    if (onSelect) {
      onSelect(index)
      setIsVisible(false)
    }
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
            br={currencyBr || 13}
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
            const { logo, value, label, withRadioButton } = item

            const showRadioButton =
              withRadioButton === true && typeof toggleRadioButton !== 'undefined'
            const isRadioButtonActive = radioButtonValues?.indexOf(value) !== -1

            return (
              <Styles.ListItem
                key={`${value}/${index}`}
                onClick={() => (toggleRadioButton ? toggleRadioButton(value) : onSelectItem(index))}
                disabled={false}
                pv={showRadioButton && !logo ? 18 : 10}
              >
                {logo ? (
                  <CurrencyLogo
                    symbol={logo.symbol}
                    width={logo.width}
                    height={logo.height}
                    br={logo.br}
                    background={logo.background}
                    chain={logo?.chain}
                    name={logo?.name || tokenName}
                  />
                ) : null}
                <Styles.ListItemRow withLogo={typeof logo !== 'undefined'}>
                  {label?.length ? <Styles.ListItemLabel>{label}</Styles.ListItemLabel> : null}
                  <Styles.ListItemValue>{value}</Styles.ListItemValue>
                </Styles.ListItemRow>

                {withRadioButton && typeof toggleRadioButton !== 'undefined' ? (
                  <RadioButton
                    isActive={isRadioButtonActive}
                    onToggle={() => toggleRadioButton(value)}
                  />
                ) : null}
              </Styles.ListItem>
            )
          })}
        </Styles.NetworksList>
      ) : null}
    </Styles.Wrapper>
  )
}

export default CurrenciesDropdown
