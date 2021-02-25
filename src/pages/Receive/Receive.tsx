import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { browser, Tabs } from 'webextension-polyfill-ts'
import QRCode from 'qrcode.react'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'
import DropDown from '@components/DropDown'

// Modals
import ConfirmShowingPrivateKeyModal from '@modals/ConfirmShowingPrivateKey'

// Hooks
import useVisible from '@hooks/useVisible'

// Icons
import moreIcon from '@assets/icons/more.svg'

// Styles
import Styles from './styles'

interface LocationState {
  currency: string
  symbol: string
  address: string
}

const Receive: React.FC = () => {
  const { state: locationState } = useLocation<LocationState>()
  const history = useHistory()

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [activeModal, setActiveModal] = React.useState<null | string>(null)

  const { currency, symbol, address } = locationState

  const openPage = (path: string): void => {
    history.push(path)
  }

  const openWebPage = (url: string): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url })
  }

  const onClickDropDown = (index: number) => {
    setIsVisible(false)

    if (index === 0) {
      setActiveModal('confirmShowPrivateKey')
    } else if (index === 1) {
      openWebPage(`https://blockchair.com/bitcoin/address/${address}`)
    }
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={() => openPage('/wallets')} backTitle="Home" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Heading>
              <Styles.UpdateBalanceBlock>
                <Styles.BalanceLabel>Balance</Styles.BalanceLabel>
                <Styles.RefreshIconRow>
                  <Styles.RefreshIcon />
                </Styles.RefreshIconRow>
              </Styles.UpdateBalanceBlock>
              <Styles.MoreButton onClick={() => setIsVisible(!isVisible)}>
                <SVG src={moreIcon} width={18} height={3.78} title="more" />
              </Styles.MoreButton>
            </Styles.Heading>

            <DropDown
              dropDownRef={ref}
              isVisible={isVisible}
              list={[
                { icon: '1', title: 'Show Private key' },
                { icon: '2', title: 'View in Explorer' },
              ]}
              onClick={onClickDropDown}
            />

            <Styles.CurrencyBlock>
              <CurrencyLogo symbol={symbol} width={22} height={22} />
              <Styles.CurrencyName>{currency}</Styles.CurrencyName>
            </Styles.CurrencyBlock>

            <Styles.Balance>0.16823857 BTC</Styles.Balance>
            <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
          </Styles.Row>
          <Styles.ReceiveBlock>
            <QRCode width={120} height={120} value={address} />
            <Styles.Address>{address}</Styles.Address>
            <Button label="Send BTC" onClick={() => openPage('/send')} />
          </Styles.ReceiveBlock>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmShowingPrivateKeyModal
        isActive={activeModal === 'confirmShowPrivateKey'}
        onClose={() => setActiveModal(null)}
      />
    </>
  )
}

export default Receive
