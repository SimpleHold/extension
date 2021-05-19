import * as React from 'react'
import { render } from 'react-dom'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'

// Styles
import Styles from './styles'

interface Props {
  amount?: number
  symbol?: string
  addressFrom?: string
  addressTo?: string
  networkFee?: number
  tabInfo?: {
    favIconUrl: string
    url: string
  }
}

const SendConfirmation: React.FC = () => {
  const [props, setProps] = React.useState<Props>({})
  const [activeDrawer, setActiveDrawer] = React.useState<'confirm' | null>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)

  React.useEffect(() => {
    checkProps()
  }, [])

  const parseJson = (value: string): { [key: string]: any } | null => {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }

  const checkProps = async (): Promise<void> => {
    const data = localStorage.getItem('sendConfirmationData')

    if (data) {
      const parseData = parseJson(data)

      if (parseData) {
        localStorage.removeItem('sendConfirmationData')
        return setProps(parseData)
      }
    }

    onClose()
  }

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = (): void => {
    setActiveDrawer('confirm')
  }

  const onConfirmSend = () => {}

  return (
    <ExternalPageContainer
      onClose={onClose}
      headerStyle="green"
      backPageTitle="Send"
      backPageUrl="send.html"
    >
      <>
        <Styles.Body>
          <Styles.Row>
            <Styles.Title>Confirm the sending</Styles.Title>
            <Styles.SiteInfo>
              <Styles.SiteInfoLabel>Confirm sending on</Styles.SiteInfoLabel>
              {props?.tabInfo ? (
                <Styles.SiteInfoRow>
                  <Styles.SiteFavicon src={props.tabInfo.favIconUrl} />
                  <Styles.SiteUrl>{props.tabInfo.url}</Styles.SiteUrl>
                </Styles.SiteInfoRow>
              ) : null}
            </Styles.SiteInfo>

            <Styles.OrderCheck>
              <Styles.List>
                <Styles.ListTitle>Amount:</Styles.ListTitle>
                <Styles.ListRow>
                  <Styles.Amount>{props?.amount}</Styles.Amount>
                  <Styles.ListText>{toUpper(props.symbol)}</Styles.ListText>
                </Styles.ListRow>
              </Styles.List>
              <Styles.List>
                <Styles.ListTitle>Network fee:</Styles.ListTitle>
                <Styles.ListRow>
                  <Styles.Amount>{props.networkFee}</Styles.Amount>
                  <Styles.ListText>{toUpper(props.symbol)}</Styles.ListText>
                </Styles.ListRow>
              </Styles.List>

              <Styles.DashedDivider>
                <Styles.DashedDividerLine />
              </Styles.DashedDivider>

              <Styles.List>
                <Styles.ListTitle>Total:</Styles.ListTitle>
                <Styles.ListRow>
                  <Styles.Amount>{Number(props?.amount) + Number(props.networkFee)}</Styles.Amount>
                  <Styles.ListText>{toUpper(props.symbol)}</Styles.ListText>
                </Styles.ListRow>
              </Styles.List>
            </Styles.OrderCheck>

            <Styles.DestinationsList>
              <Styles.Destinate>
                <Styles.DestinateTitle>From</Styles.DestinateTitle>
                <Styles.DestinateText>bc1q34aq5drpuywhup9892qp6svr8ldz</Styles.DestinateText>
              </Styles.Destinate>
              <Styles.Destinate>
                <Styles.DestinateTitle>To</Styles.DestinateTitle>
                <Styles.DestinateText>bc1q34aq5rpwy3whup9892qp6svr8ldz</Styles.DestinateText>
              </Styles.Destinate>
            </Styles.DestinationsList>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isSmall isLight onClick={onClose} mr={7.5} />
            <Button label="Confirm" isSmall onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Body>
        <ConfirmDrawer
          isActive={activeDrawer === 'confirm'}
          onClose={() => setActiveDrawer(null)}
          title="Enter the password to restore your wallet"
          textInputValue={password}
          onChangeText={setPassword}
          onConfirm={onConfirmSend}
          textInputType="password"
          inputLabel="Enter password"
          isButtonDisabled={!validatePassword(password)}
          inputErrorLabel={passwordErrorLabel}
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

render(<SendConfirmation />, document.getElementById('send-confirmation'))
