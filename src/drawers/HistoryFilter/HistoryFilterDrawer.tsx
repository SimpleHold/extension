import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'
import Dropdown from './components/Dropdown'
import Currency from './components/Currency'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
}

type TStatuses = 'sended' | 'received' | 'pending'

type TStatusItem = {
  title: string
  key: TStatuses
}

const statuses: TStatusItem[] = [
  {
    title: 'Sended',
    key: 'sended',
  },
  {
    title: 'Received',
    key: 'received',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
]

const HistoryFilterDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [status, setStatus] = React.useState<TStatuses | null>('received')

  const onApply = (): void => {}

  const selectStatus = (status: TStatuses) => (): void => {
    setStatus(status)
  }

  const renderCurrencies = (
    <>
      <Currency symbol="btc" name="Bitcoin" isActive onToggle={() => null} />
    </>
  )

  const renderAddresses = (
    <div>
      <p>KEK</p>
    </div>
  )

  return (
    <DrawerWrapper
      title="Filter history"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      height={540}
    >
      <>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Status</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Styles.Statuses>
              {statuses.map((statusItem: TStatusItem) => {
                const { title, key } = statusItem
                const isActive = status === key

                return (
                  <Styles.Status key={key} isActive={isActive} onClick={selectStatus(key)}>
                    <Styles.StatusTitle>{title}</Styles.StatusTitle>
                  </Styles.Status>
                )
              })}
            </Styles.Statuses>
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Currency</Styles.GroupTitle>
              <Styles.ResetGroup>
                <Styles.ResetTitle>2 selected</Styles.ResetTitle>
                <Styles.ResetIcon />
              </Styles.ResetGroup>
            </Styles.GroupHeading>
            <Dropdown title="Select currencies" render={renderCurrencies} />
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Address</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Dropdown title="Select addresses" render={renderAddresses} />
          </Styles.Group>
        </Styles.Row>
        <Button label="Apply" isLight onClick={onApply} />
      </>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer
