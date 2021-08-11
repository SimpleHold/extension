import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import TextInput from '@components/TextInput'
import Button from '@components/Button'

import WalletCard from './components/WalletCard'
import NetworkFee from './components/NetworkFee'

// Utils
import { toUpper } from '@utils/format'

// Types
import { Props } from './types'

// Styles
import Styles from './styles'

const SendFormShared: React.FC<Props> = (props) => {
  const {
    balance,
    estimated,
    symbol,
    hardware,
    walletName,
    selectedAddress,
    tokenName,
    wallets,
    changeWallet,
    tokenChain,
    onCancel,
    onConfirm,
    isDisabled,
    address,
    setAddress,
    addressErrorLabel,
    openWalletsDrawer,
    onGenerateExtraId,
    checkAddress,
    onSendAll,
    extraIdName,
    extraId,
    setExtraId,
    amount,
    setAmount,
    amountErrorLabel,
    checkAmount,
    isFeeLoading,
    fee,
    feeSymbol,
    feeType,
    setFeeType,
    isCurrencyBalanceError,
    currencyBalance,
    isCustomFee,
    showFeeDrawer,
    isIncludeFee,
    toggleIncludeFee,
    tabInfo,
  } = props

  const renderInputButton = (inputType: 'address' | 'extraId' | 'amount') => {
    if (inputType === 'address' && wallets.length > 1) {
      return {
        label: 'To my wallet',
        onClick: openWalletsDrawer,
      }
    }

    if (inputType === 'extraId') {
      return {
        label: 'Generate',
        onClick: onGenerateExtraId,
      }
    }

    if (inputType === 'amount' && Number(balance) > 0) {
      return {
        label: 'Send all',
        onClick: onSendAll,
      }
    }

    return undefined
  }

  const getAmountTooltip = (): string | undefined => {
    if (toUpper(symbol) === 'XRP' && amountErrorLabel) {
      return 'The network requires at least 20 XRP balance at all times.'
    }

    return undefined
  }

  return (
    <Styles.Container>
      {tabInfo ? (
        <Styles.TabInfo>
          <Styles.Title>Send it on</Styles.Title>
          <Styles.SiteInfo>
            <Styles.SiteFavicon src={tabInfo.favIconUrl} />
            <Styles.SiteUrl>{tabInfo.url}</Styles.SiteUrl>
          </Styles.SiteInfo>
        </Styles.TabInfo>
      ) : null}
      <Styles.Body>
        <Styles.Row>
          <WalletCard
            balance={balance}
            estimated={estimated}
            symbol={symbol}
            hardware={hardware}
            walletName={walletName}
            address={selectedAddress}
            name={tokenName}
            wallets={wallets}
            changeWallet={changeWallet}
            tokenChain={tokenChain}
          />
          <Styles.Form>
            <Styles.FormBody>
              <TextInput
                label="Recipient Address"
                value={address}
                onChange={setAddress}
                disabled={balance === null}
                type="text"
                renderButton={renderInputButton('address')}
                errorLabel={addressErrorLabel}
                onBlurInput={checkAddress}
              />
              {extraIdName ? (
                <TextInput
                  label={`${extraIdName} (optional)`}
                  value={extraId}
                  onChange={setExtraId}
                  disabled={balance === null}
                  type="text"
                  renderButton={renderInputButton('extraId')}
                />
              ) : null}
              <TextInput
                label={`Amount (${toUpper(symbol)})`}
                value={amount}
                onChange={setAmount}
                disabled={balance === null}
                type="number"
                renderButton={renderInputButton('amount')}
                errorLabel={amountErrorLabel}
                onBlurInput={checkAmount}
                labelTooltip={getAmountTooltip()}
              />
            </Styles.FormBody>
          </Styles.Form>

          <NetworkFee
            isLoading={isFeeLoading}
            fee={fee}
            symbol={feeSymbol}
            type={feeType}
            setType={setFeeType}
            isBalanceError={isCurrencyBalanceError && currencyBalance !== null}
            withButton={isCustomFee}
            isIncludeFee={isIncludeFee}
            toggleIncludeFee={toggleIncludeFee}
          />

          <Styles.AboutFee onClick={showFeeDrawer}>
            <SVG src="../../assets/icons/ask.svg" width={15} height={15} />
            <Styles.AboutFeeLabel>What is Network Fee</Styles.AboutFeeLabel>
          </Styles.AboutFee>
        </Styles.Row>
      </Styles.Body>
      <Styles.Actions>
        <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
        <Button label="Send" onClick={onConfirm} disabled={isDisabled} ml={7.5} />
      </Styles.Actions>
    </Styles.Container>
  )
}

export default SendFormShared
