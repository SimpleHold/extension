import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Utils
import { toLower } from '@utils/format'

// Config
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

type TSelectedCurrency = {
  symbol?: string
  chain?: string
  type?: string
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
  selectedCurrencies?: TSelectedCurrency[]
  renderRow?: React.ReactElement<any, any> | null
  padding?: string
  withActions?: boolean
  onResetDropdown?: () => void
  onClose?: () => void
  onApplyDropdown?: () => void
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
    selectedCurrencies,
    renderRow,
    padding,
    withActions,
    onResetDropdown,
    onClose,
    onApplyDropdown,
  } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  React.useEffect(() => {
    if (!isVisible && onClose) {
      onClose()
    }
  }, [isVisible])

  const getTokenBackground =
    tokenChain && tokenName ? getCurrencyByChain(tokenChain)?.background : '#1D1D22'

  const onSelectItem = (index: number): void => {
    if (onSelect) {
      onSelect(index)
      setIsVisible(false)

      if (onClose) {
        onClose()
      }
    }
  }

  const onApply = (): void => {
    setIsVisible(false)

    if (onApplyDropdown) {
      onApplyDropdown()
    }
  }

  return (
    <Styles.Wrapper ref={ref} isVisible={isVisible}>
      <Styles.Container
        onClick={() => (disabled ? null : setIsVisible(!isVisible))}
        isVisible={isVisible}
        disabled={disabled}
        isNotSelected={!currencySymbol && !value}
        padding={padding}
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
        {renderRow || (
          <Styles.Row isNotSelected={!currencySymbol && !value}>
            <Styles.Info>
              {label?.length ? (
                <Styles.Label isNotSelected={!currencySymbol && !value}>{label}</Styles.Label>
              ) : null}
              {value?.length ? <Styles.Value>{value}</Styles.Value> : null}
            </Styles.Info>
            {!disabled ? (
              <Styles.ArrowIconRow>
                <SVG src="../../assets/icons/arrow.svg" width={8} height={14} />
              </Styles.ArrowIconRow>
            ) : null}
          </Styles.Row>
        )}
      </Styles.Container>

      {!disabled ? (
        <Styles.DropdownRow isVisible={isVisible}>
          <Styles.List maxHeight={withActions ? 180 : 240}>
            {list.map((item: TList, index: number) => {
              const { logo, value, label, withRadioButton } = item

              const showRadioButton =
                withRadioButton === true && typeof toggleRadioButton !== 'undefined'
              const isRadioButtonActive = logo
                ? selectedCurrencies?.find(
                    (currency: TSelectedCurrency) =>
                      toLower(currency.symbol) === toLower(logo.symbol) &&
                      toLower(currency?.chain) === toLower(logo?.chain)
                  ) !== undefined
                : selectedCurrencies?.find(
                    (currency: TSelectedCurrency) => toLower(currency.type) === toLower(value)
                  ) !== undefined

              return (
                <Styles.ListItem
                  key={`${value}/${index}`}
                  onClick={() =>
                    toggleRadioButton ? toggleRadioButton(value) : onSelectItem(index)
                  }
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
          </Styles.List>
          {withActions ? (
            <Styles.DropdownActions>
              <Styles.DropdownButton color="#EB5757" onClick={onResetDropdown}>
                <Styles.DropdownButtonLabel>Reset</Styles.DropdownButtonLabel>
              </Styles.DropdownButton>
              <Styles.DropdownButton color="#3FBB7D" onClick={onApply}>
                <Styles.DropdownButtonLabel>Apply</Styles.DropdownButtonLabel>
              </Styles.DropdownButton>
            </Styles.DropdownActions>
          ) : null}
        </Styles.DropdownRow>
      ) : null}
    </Styles.Wrapper>
  )
}

export default CurrenciesDropdown
