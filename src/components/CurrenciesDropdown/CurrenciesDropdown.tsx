import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Utils
import { toLower } from '@utils/format'

// Config
import { getCurrencyByChain } from '@config/currencies/utils'

// Hooks
import useVisible from '@hooks/useVisible'

// Assets
import arrowIcon from '@assets/icons/arrow.svg'

// Types
import { Props, TList, TSelectedCurrency } from './types'

// Styles
import Styles from './styles'

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
    maxHeight,
  } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const [isApplied, setApplied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!isVisible && !isApplied && onClose) {
      onClose()
    }
  }, [isVisible])

  React.useEffect(() => {
    if (isApplied) {
      setIsVisible(false)
    }
  }, [isApplied])

  const getTokenBackground =
    tokenChain && tokenName ? getCurrencyByChain(tokenChain)?.background : '#1D1D22'

  const onSelectItem = (index: number): void => {
    if (onSelect) {
      onSelect(index)
      setIsVisible(false)
    }
  }

  const onApply = (): void => {
    setApplied(true)
  }

  const onReset = (): void => {
    setIsVisible(false)

    if (onResetDropdown) {
      onResetDropdown()
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
            size={40}
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
                <SVG src={arrowIcon} width={8} height={14} />
              </Styles.ArrowIconRow>
            ) : null}
          </Styles.Row>
        )}
      </Styles.Container>

      {!disabled ? (
        <Styles.DropdownRow isVisible={isVisible}>
          <Styles.List maxHeight={maxHeight || withActions ? 180 : 240}>
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
                : false

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
                      size={logo.width}
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
              <Styles.DropdownButton color="#EB5757" onClick={onReset}>
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
