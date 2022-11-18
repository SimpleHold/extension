import * as React from 'react'
import { render } from 'react-dom'
import browser from 'webextension-polyfill'
import { observer } from 'mobx-react-lite'
import SVG from 'react-inlinesvg'

// Components
import Button from '@components/Button'

// Drawers
import NetworkFeeDrawer from '@drawers/NetworkFee'
import WalletsDrawer from '@drawers/Wallets'
import InsufficientFeeDrawer from '@drawers/InsufficientFee'

// Containers
import ExternalPageContainer from '@containers/ExternalPage'
import SendContainer from '@containers/Send'

// Utils
import { getItem, removeItem, setItem } from '@utils/storage'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'

// Store
import { useSendStore } from '@store/send/store'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'

// Assets
import notFoundIcon from '@assets/icons/notFound.svg'

// Types
import { TFee } from '@utils/api/types'
import { TBackgroundProps } from './types'

// Styles
import Styles from './styles'

const LS = {
  getItem: async (key: string) => (await browser.storage.local.get(key))[key],
}

const Send: React.FC = () => {
  const [backgroundProps, setBackgroundProps] = React.useState<TBackgroundProps | null>(null)
  const [isDraggable, setDraggable] = React.useState<boolean>(false)

  const {
    activeDrawer,
    setActiveDrawer,
    setWallet,
    wallet,
    drawerWallets,
    fees,
    feeSymbol,
    setFeeType,
    setFee,
    fee,
    isCurrencyBalanceError,
    feeType,
    setAmount,
    isFeeLoading,
    amount,
    isZeroFee,
    balance,
    currencyInfo,
    warning,
    utxos,
    coinPrice,
  } = useSendStore()

  const isButtonDisabled =
    isFeeLoading ||
    !amount.length ||
    (isZeroFee ? false : fee === 0) ||
    Number(balance) === 0 ||
    Number(amount) > Number(balance) ||
    isCurrencyBalanceError ||
    Number(amount) <= 0 ||
    !wallet ||
    !currencyInfo ||
    warning !== null

  React.useEffect(() => {
    getStorageData()
    getQueryParams()
  }, [])

  React.useEffect(() => {
    if (backgroundProps) {
      getWalletsList()

      setAmount(backgroundProps.amount)
    }
  }, [backgroundProps])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === 'Escape' || key === 'Esc') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const getWalletsList = (): void => {
    const wallets = getWallets()

    let currency: undefined | string = undefined
    let chain: undefined | string = undefined

    if (backgroundProps) {
      if (backgroundProps?.currency) {
        currency = backgroundProps.currency
      }

      if (backgroundProps?.chain) {
        chain = backgroundProps.chain
      }
    }

    if (wallets?.length && currency) {
      const filterWallets = wallets.filter(
        (wallet: IWallet) =>
          toLower(wallet.symbol) === toLower(currency) && toLower(wallet.chain) === toLower(chain)
      )

      if (filterWallets.length) {
        setWallet(filterWallets[0])
      }
    }
  }

  const getStorageData = async (): Promise<void> => {
    const sendPagePropsData = await LS.getItem('sendPageProps')

    if (sendPagePropsData) {
      setBackgroundProps(JSON.parse(sendPagePropsData))
    }
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })
  }

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryDraggable = searchParams.get('isDraggable')

    if (queryDraggable === 'true') {
      setDraggable(true)
    }
  }

  const getCurrencyName = (): string => {
    if (backgroundProps) {
      const getInfo = getCurrencyInfo(backgroundProps.currency)

      if (getInfo) {
        return getInfo.name
      }
    }

    return ''
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onSelectFee = (data: TFee): void => {
    setActiveDrawer(null)

    const getValue = fees.find((item: TFee) => item.type === data.type)

    setFeeType(data.type)
    setFee(getValue?.value || 0)
  }

  const onClickWallet = (address: string) => (): void => {
    setActiveDrawer(null)

    if (toLower(wallet?.address) !== toLower(address)) {
      const findWallet = drawerWallets.find((item) => toLower(item.address) === toLower(address))

      if (findWallet) {
        setWallet(findWallet)
      }
    }
  }

  const onNext = async (): Promise<void> => {
    const { id } = await getCurrentTab()

    const url = getUrl('send-confirm.html')

    const storeProps = {
      fee,
      feeSymbol,
      balance,
      utxos,
      coinPrice,
    }

    if (id) {
      setItem('backgroundProps', JSON.stringify(backgroundProps))
      setItem('storeProps', JSON.stringify(storeProps))

      if (isDraggable) {
        location.href = `${url}?isDraggable=true`
      } else {
        await updateTab(id, {
          url,
        })
      }
    }
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={isDraggable}>
      <>
        <Styles.Container>
          {wallet ? (
            <Styles.Row>
              <SendContainer
                onNext={onNext}
                symbol={wallet.symbol}
                onBack={onClose}
                openFrom="browser"
              />
            </Styles.Row>
          ) : (
            <Styles.NotFound>
              <SVG src={notFoundIcon} width={60} height={60} />
              <Styles.NotFoundText>{getCurrencyName()} addresses was not found</Styles.NotFoundText>
            </Styles.NotFound>
          )}
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Send" onClick={onNext} disabled={isButtonDisabled} ml={7.5} />
          </Styles.Actions>
        </Styles.Container>
        <NetworkFeeDrawer
          isActive={activeDrawer === 'networkFee'}
          onClose={onCloseDrawer}
          fees={fees}
          symbol={feeSymbol}
          onSelect={onSelectFee}
          activeFeeType={feeType}
          isCurrencyBalanceError={isCurrencyBalanceError}
          fee={fee}
        />
        <WalletsDrawer
          isActive={activeDrawer === 'wallets'}
          onClose={onCloseDrawer}
          wallets={drawerWallets}
          onClickWallet={onClickWallet}
          selectedAddress={wallet?.address}
        />
        {wallet ? (
          <InsufficientFeeDrawer
            isActive={activeDrawer === 'insufficientFee'}
            onClose={onCloseDrawer}
            value={fee}
            symbol={feeSymbol}
            wallet={wallet}
          />
        ) : null}
      </>
    </ExternalPageContainer>
  )
}

const SendObserver = observer(Send)

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  render(<SendObserver />, document.getElementById('send'))
})
