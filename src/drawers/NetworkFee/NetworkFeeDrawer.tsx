import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import LightHeader from '@components/LightHeader'
import Skeleton from '@components/Skeleton'
import Button from '@components/Button'
import FilledWarning from '@components/FilledWarning'
import Collapsible from '@components/Collapsible'

// Utils
import { multiplied } from '@utils/bn'
import { getEstimated } from '@utils/api'
import { toUpper } from '@utils/format'
import { logEvent } from '@utils/metrics'

// Config
import * as events from '@config/events'

// Types
import { TFee, TFeeTypes } from '@utils/api/types'

// Assets
import slowIcon from '@assets/icons/fees/slow.svg'
import averageIcon from '@assets/icons/fees/average.svg'
import fastIcon from '@assets/icons/fees/fast.svg'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  fees: TFee[]
  symbol: string
  onSelect: (feeType: TFee) => void
  activeFeeType: TFeeTypes
  isCurrencyBalanceError: boolean
  fee: number
}

const colors = ['rgba(249, 145, 69, 0.15)', 'rgba(63, 187, 125, 0.15)', 'rgba(69, 76, 249, 0.2)']
const icons = [slowIcon, averageIcon, fastIcon]

const NetworkFeeDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, fees, symbol, onSelect, activeFeeType, isCurrencyBalanceError, fee } =
    props

  const [estimated, setEstimated] = React.useState<number>(0)

  React.useEffect(() => {
    if (fees.length && estimated === 0) {
      getFeesEstimated()
    }
  }, [fees, estimated])

  const getFeesEstimated = async (): Promise<void> => {
    const value = await getEstimated(1, symbol, 'usd')

    setEstimated(value)
  }

  const onClickItem = (item: TFee) => (): void => {
    if (item.type !== activeFeeType) {
      logEvent({
        name: events.SEND_SELECT_FEE,
      })

      onSelect(item)
    }
  }

  return (
    <DrawerWrapper isActive={isActive} onClose={onClose} isFullScreen padding="0">
      <>
        <Styles.Body>
          <LightHeader title="Select Network Fee" onBack={onClose} />
          <Styles.Row>
            {fees.map((item: TFee, index: number) => {
              const { type, value } = item
              const isActive = type === activeFeeType

              return (
                <Styles.FeeButton
                  key={type}
                  className={isActive ? 'active' : ''}
                  onClick={onClickItem(item)}
                >
                  <Styles.FeeButtonIconRow style={{ backgroundColor: colors[index] }}>
                    <SVG src={icons[index]} width={24} height={24} />
                  </Styles.FeeButtonIconRow>
                  <Styles.FeeButtonRow>
                    <Styles.FeeButtonType>{type}</Styles.FeeButtonType>
                    <Styles.FeeButtonValues>
                      <Styles.FeeButtonValue>
                        {value} {symbol}
                      </Styles.FeeButtonValue>
                      <Skeleton
                        width={40}
                        height={16}
                        type="gray"
                        br={4}
                        isLoading={estimated === 0}
                        mt={3}
                      >
                        <Styles.FeeButtonEstimated>
                          {multiplied(estimated, value)}
                        </Styles.FeeButtonEstimated>
                      </Skeleton>
                    </Styles.FeeButtonValues>
                  </Styles.FeeButtonRow>
                </Styles.FeeButton>
              )
            })}

            {isCurrencyBalanceError ? (
              <FilledWarning
                text={`You need ${fee} ${toUpper(
                  symbol
                )} to make a transfer. Your balance is currently insufficient to make an exchange.`}
                mt={20}
              />
            ) : null}

            <Collapsible
              title="What is Network Fee?"
              text="Every time you send any cryptocurrency, from your address to another, there is a Network Transaction fee, and the actual fee you pay will vary according to the network. The more amount you pay the faster your transaction is processed. SimpleHold does not profit from it."
            />
          </Styles.Row>
        </Styles.Body>
        <Styles.ButtonRow>
          <Button label="Done" onClick={onClose} />
        </Styles.ButtonRow>
      </>
    </DrawerWrapper>
  )
}

export default NetworkFeeDrawer
