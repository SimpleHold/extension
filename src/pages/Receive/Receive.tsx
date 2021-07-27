import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import copy from 'copy-to-clipboard'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'
import Button from '@components/Button'
import DropDown from '@components/DropDown'

// Drawers
import ExtraIdDrawer from '@drawers/ExtraId'

// Utils
import { toUpper } from '@utils/format'
import { getExtraIdName } from '@utils/address'
import { logEvent } from '@utils/amplitude'

// Hooks
import useVisible from '@hooks/useVisible'

// Config
import { ADDRESS_RECEIVE } from '@config/events'
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Assets
import moreIcon from '@assets/icons/more.svg'
import plusCircleIcon from '@assets/icons/plusCircle.svg'

// Types
import { TDropdowbList } from '@components/DropDown/DropDown'

// Styles
import Styles from './styles'

interface LocationState {
  address: string
  symbol: string
  chain?: string
}

const ReceivePage: React.FC = () => {
  const {
    state: { address, symbol, chain },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [isCopied, setIsCopied] = React.useState<boolean>(false)
  const [dropdownList, setDropdownList] = React.useState<TDropdowbList[]>([])
  const [extraIdName, setExtraIdName] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'extraId'>(null)

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  React.useEffect(() => {
    logEvent({
      name: ADDRESS_RECEIVE,
    })

    getDropdownList()
  }, [])

  const getDropdownList = (): void => {
    const list: TDropdowbList[] = []

    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)

      list.push({
        icon: { source: plusCircleIcon, width: 18, height: 18 },
        title: `Generate ${name}`,
      })
    }

    setDropdownList(list)
  }

  const toggleDropdown = (): void => {
    setIsVisible(!isVisible)
  }

  const onClickDropDown = (index: number): void => {
    toggleDropdown()

    if (index === 0 && extraIdName.length) {
      setActiveDrawer('extraId')
    }
  }

  const onCopyAddress = (): void => {
    copy(address)
    setIsCopied(true)
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Wallet" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Heading>
              <Styles.Title>Receive {toUpper(symbol)}</Styles.Title>
              {dropdownList.length ? (
                <Styles.MoreButton onClick={toggleDropdown}>
                  <SVG src={moreIcon} width={16} height={3.36} />
                </Styles.MoreButton>
              ) : null}

              <DropDown
                dropDownRef={ref}
                isVisible={isVisible}
                list={dropdownList}
                onClick={onClickDropDown}
              />
            </Styles.Heading>

            <Styles.Receive>
              <QRCode size={170} value={address} />
              <Styles.Address>{address}</Styles.Address>
            </Styles.Receive>

            <Styles.Warning>
              Send only {currency?.name} to this address. Sending any other coins may result in
              permanent loss.
            </Styles.Warning>
          </Styles.Row>
          <Button label={isCopied ? 'Copied!' : 'Copy address'} onClick={onCopyAddress} />
        </Styles.Container>
      </Styles.Wrapper>
      <ExtraIdDrawer
        isActive={activeDrawer === 'extraId'}
        onClose={onCloseDrawer}
        title={extraIdName}
        symbol={symbol}
      />
    </>
  )
}

export default ReceivePage
