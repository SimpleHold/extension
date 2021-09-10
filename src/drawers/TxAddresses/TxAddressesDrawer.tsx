import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Tabs from '@components/Tabs'
import Address from './components/Address'
import DividerLine from '@components/DividerLine'
import Button from '@components/Button'

// Types
import { TTxHistoryAddress } from '@utils/api/types'
import { TTab } from '@components/Tabs/types'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  addressesFrom: TTxHistoryAddress[]
  addressesTo: TTxHistoryAddress[]
  symbol: string
  activeDrawerTabKey: 'senders' | 'recipients'
}

const TxAddressesDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, addressesFrom, addressesTo, symbol, activeDrawerTabKey } = props

  const [activeTabKey, setActiveTabKey] = React.useState<string>('senders')

  React.useEffect(() => {
    setActiveTabKey(activeDrawerTabKey)
  }, [activeDrawerTabKey])

  const renderAddresses = (data: TTxHistoryAddress[]) => (
    <Styles.List>
      {data.map((item: TTxHistoryAddress, index: number) => {
        const { address, amount, estimated } = item

        return (
          <Styles.Group key={`${address}/${index}`}>
            <Address address={address} amount={amount} estimated={estimated} symbol={symbol} />
            {index !== data.length - 1 ? <DividerLine /> : null}
          </Styles.Group>
        )
      })}
    </Styles.List>
  )

  const tabs: TTab[] = [
    {
      title: 'Senders',
      key: 'senders',
      badge: addressesFrom.length,
      renderItem: renderAddresses(addressesFrom),
    },
    {
      title: 'Recipients',
      key: 'recipients',
      badge: addressesTo.length,
      renderItem: renderAddresses(addressesTo),
    },
  ]

  const onSelectTab = (tabKey: string) => (): void => {
    setActiveTabKey(tabKey)
  }

  return (
    <DrawerWrapper isActive={isActive} onClose={onClose} padding="0" height={540}>
      <Styles.Row>
        <Tabs tabs={tabs} activeTabKey={activeTabKey} onSelectTab={onSelectTab} />

        <Styles.Actions>
          <Button label="Close" onClick={onClose} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default TxAddressesDrawer
