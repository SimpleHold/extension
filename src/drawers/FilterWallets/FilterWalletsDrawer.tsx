import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
}

const FilterWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const onSelectDropdown = (index: number): void => {}

  const onApply = (): void => {}

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.SelectCurrencyRow>
          <CurrenciesDropdown
            list={[]}
            onSelect={onSelectDropdown}
            currencyBr={13}
            label="Select currency"
          />
          <Styles.SelectedAmount>Selected all currencies</Styles.SelectedAmount>
        </Styles.SelectCurrencyRow>

        <Styles.DividerLine />

        <Styles.Filter>
          <Styles.FilterRow>
            <Styles.FilterTitle>Show hidden wallet</Styles.FilterTitle>
            <Styles.FilterBadge>
              <Styles.FilterBadgeText>50</Styles.FilterBadgeText>
            </Styles.FilterBadge>
          </Styles.FilterRow>
          <Styles.Switch />
        </Styles.Filter>

        <Styles.DividerLine />

        <Styles.Filter>
          <Styles.FilterRow>
            <Styles.FilterTitle>Show zero balances</Styles.FilterTitle>
            <Styles.FilterBadge>
              <Styles.FilterBadgeText>50</Styles.FilterBadgeText>
            </Styles.FilterBadge>
          </Styles.FilterRow>
          <Styles.Switch />
        </Styles.Filter>

        <Styles.Actions>
          <Button label="Apply" isDanger isSmall onClick={onApply} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FilterWalletsDrawer
