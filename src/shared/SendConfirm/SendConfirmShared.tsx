import * as React from 'react'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Button from '@components/Button'

// Utils
import { short, toUpper } from '@utils/format'

// Types
import { Props } from './types'

// Styles
import Styles from './styles'

const SendConfirmShared: React.FC<Props> = (props) => {
  const {
    amount,
    symbol,
    networkFee,
    addressFrom,
    addressTo,
    networkFeeSymbol,
    tokenChain,
    tokenName,
    onCancel,
    onConfirm,
    isButtonLoading,
    tabInfo,
  } = props

  const total = new BigNumber(amount).plus(networkFee).toNumber()

  return (
    <Styles.Container>
      <Styles.Row>
        <Styles.Title>Confirm the sending</Styles.Title>
        {tabInfo ? (
          <Styles.TabInfo>
            <Styles.TabInfoLabel>on</Styles.TabInfoLabel>
            <Styles.SiteInfo>
              <Styles.SiteFavicon src={tabInfo.favIconUrl} />
              <Styles.SiteUrl>{tabInfo.url}</Styles.SiteUrl>
            </Styles.SiteInfo>
          </Styles.TabInfo>
        ) : (
          <Styles.SubTitle>Check transaction details</Styles.SubTitle>
        )}

        <Styles.Destinations>
          <Styles.CurrencyLogo>
            <CurrencyLogo size={50} symbol={symbol} chain={tokenChain} name={tokenName} />
          </Styles.CurrencyLogo>

          <Styles.Destination>
            <Styles.DestinationType>From</Styles.DestinationType>
            <Styles.DestinationText>{short(addressFrom, 20)}</Styles.DestinationText>
          </Styles.Destination>

          <Styles.Destination>
            <Styles.DestinationType>To</Styles.DestinationType>
            <Styles.DestinationText>{short(addressTo, 20)}</Styles.DestinationText>
          </Styles.Destination>
        </Styles.Destinations>

        <Styles.Order>
          <Styles.Amounts>
            <Styles.Table>
              <Styles.Tbody>
                <Styles.TableTr>
                  <Styles.TableTd>
                    <Styles.TableTitle>Amount</Styles.TableTitle>
                  </Styles.TableTd>
                  <Styles.TableTd>
                    <Styles.TableAmount>
                      {numeral(amount).format('0.[00000000]')}
                    </Styles.TableAmount>
                  </Styles.TableTd>
                  <Styles.TableTd>
                    <Styles.TableSymbol>{toUpper(symbol)}</Styles.TableSymbol>
                  </Styles.TableTd>
                </Styles.TableTr>
                <Styles.TableTr>
                  <Styles.TableTd>
                    <Styles.TableTitle>Network fee</Styles.TableTitle>
                  </Styles.TableTd>
                  <Styles.TableTd>
                    <Styles.TableAmount>
                      {numeral(networkFee).format('0.[00000000]')}
                    </Styles.TableAmount>
                  </Styles.TableTd>
                  <Styles.TableTd>
                    <Styles.TableSymbol>{toUpper(networkFeeSymbol)}</Styles.TableSymbol>
                  </Styles.TableTd>
                </Styles.TableTr>
              </Styles.Tbody>
            </Styles.Table>
          </Styles.Amounts>

          {toUpper(symbol) === toUpper(networkFeeSymbol) ? (
            <>
              <Styles.Divider>
                <Styles.DividerCircle />
                <Styles.DividerLine />
                <Styles.DividerCircle />
              </Styles.Divider>

              <Styles.Total>
                <Styles.Table>
                  <Styles.Tbody>
                    <Styles.TableTr>
                      <Styles.TableTd>
                        <Styles.TableTotal>Total</Styles.TableTotal>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableAmount>
                          {numeral(total).format('0.[00000000]')}
                        </Styles.TableAmount>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableSymbol>{toUpper(symbol)}</Styles.TableSymbol>
                      </Styles.TableTd>
                    </Styles.TableTr>
                  </Styles.Tbody>
                </Styles.Table>
              </Styles.Total>
            </>
          ) : null}
        </Styles.Order>
      </Styles.Row>
      <Styles.Actions>
        <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
        <Button label="Confirm" onClick={onConfirm} isLoading={isButtonLoading} ml={7.5} />
      </Styles.Actions>
    </Styles.Container>
  )
}

export default SendConfirmShared
