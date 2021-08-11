import * as React from 'react'
import { render } from 'react-dom'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'
import Tooltip from '@components/Tooltip'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { price, toLower, toUpper, formatEstimated } from '@utils/format'
import {
  validateAddress,
  getNewNetworkFee,
  formatUnit,
  getNetworkFeeSymbol,
  getExtraIdName,
  generateExtraId,
} from '@utils/currencies'
import bitcoinLike from '@utils/bitcoinLike'
import { getItem, setItem, removeItem } from '@utils/storage'

// Config
import { getCurrency, getCurrencyByChain, ICurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

type TabInfo = {
  favIconUrl: string
  url: string
}

interface Props {
  readOnly?: boolean
  currency?: string
  amount?: number
  recipientAddress?: string
  chain?: string
  extraId?: string
}

const Send: React.FC = () => {
  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [walletsList, setWalletsList] = React.useState<IWallet[]>([])
  const [selectedWallet, setSelectedWallet] = React.useState<null | IWallet>(null)
  const [currencyInfo, setCurrencyInfo] = React.useState<ICurrency | null>(null)
  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [addressErrorLabel, setAddressErrorLabel] = React.useState<null | string>(null)
  const [tabInfo, setTabInfo] = React.useState<TabInfo | null>(null)
  const [props, setProps] = React.useState<Props>({})
  const [networkFee, setNetworkFee] = React.useState<number>(0)
  const [isNetworkFeeLoading, setNetworkFeeLoading] = React.useState<boolean>(false)
  const [amountErrorLabel, setAmountErrorLabel] = React.useState<null | string>(null)
  const [outputs, setOutputs] = React.useState<UnspentOutput[]>([])
  const [networkFeeSymbol, setNetworkFeeSymbol] = React.useState<string>('')
  const [utxosList, setUtxosList] = React.useState<UnspentOutput[] | CardanoUnspentTxOutput[]>([])
  const [currencyBalance, setCurrencyBalance] = React.useState<number>(0)
  const [extraId, setExtraId] = React.useState<string>('')
  const [extraIdName, setExtraIdName] = React.useState<string>('')
  const [isDraggable, setIsDraggable] = React.useState<boolean>(false)

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList(getItem('sendPageProps'))
    getStorageData()
    getQueryParams()
  }, [])

  React.useEffect(() => {
    if (selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
      checkValidAddress()
      onGetNetworkFeeSymbol()
      getExtraId()
    }
  }, [selectedWallet])

  React.useEffect(() => {
    checkProps()
  }, [props])

  React.useEffect(() => {
    if (amount.length && Number(balance) > 0 && !amountErrorLabel && selectedWallet) {
      getNetworkFee()
    }
  }, [debounced])

  React.useEffect(() => {
    if (balance !== null) {
      onBlurAmountInput()
      checkValidAddress()
    }
  }, [balance])

  React.useEffect(() => {
    if (isNetworkFeeLoading && amountErrorLabel) {
      setNetworkFeeLoading(false)
    }
  }, [isNetworkFeeLoading, amountErrorLabel])

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

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryDraggable = searchParams.get('isDraggable')

    if (queryDraggable === 'true') {
      setIsDraggable(true)
    }
  }

  const getExtraId = (): void => {
    if (selectedWallet) {
      const name = getExtraIdName(selectedWallet.symbol)

      if (name) {
        setExtraIdName(name)
      }
    }
  }

  const getOutputs = async (info: ICurrency): Promise<void> => {
    if (selectedWallet) {
      if (
        bitcoinLike.coins().indexOf(info.chain) !== -1 ||
        toLower(selectedWallet?.symbol) === 'ada' ||
        toLower(selectedWallet?.symbol) === 'nebl'
      ) {
        const unspentOutputs = await getUnspentOutputs(selectedWallet.address, info.chain)
        setOutputs(unspentOutputs)
      }
    }
  }

  const onGetNetworkFeeSymbol = () => {
    if (selectedWallet) {
      const { chain, symbol } = selectedWallet

      const data = getNetworkFeeSymbol(symbol, chain)
      setNetworkFeeSymbol(data)
    }
  }

  const getNetworkFee = async (): Promise<void> => {
    if (selectedWallet) {
      setNetworkFeeLoading(true)

      const { symbol, chain, decimals, contractAddress } = selectedWallet

      const currencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (currencyInfo) {
        const data = await getNewNetworkFee({
          address: selectedWallet.address,
          symbol,
          amount,
          chain: currencyInfo.chain,
          from: selectedWallet.address,
          to: address,
          web3Params: {
            tokenChain: chain,
            decimals,
            contractAddress,
          },
          outputs,
        })

        setNetworkFeeLoading(false)

        if (data) {
          if (data.utxos) {
            setUtxosList(data?.utxos)
          }

          if (data.networkFee) {
            setNetworkFee(data.networkFee)
          } else {
            if (Number(amount) > 0 && Number(balance) > 0) {
              setAmountErrorLabel('Insufficient funds')
            }
          }

          if (typeof data.currencyBalance !== 'undefined' && !isNaN(data.currencyBalance)) {
            setCurrencyBalance(data.currencyBalance)
          }
        }
      }
    }
  }

  const checkProps = () => {
    if (Object.keys(props).length) {
      const { amount: propsAmount, recipientAddress } = props

      if (propsAmount && !isNaN(Number(propsAmount)) && Number(propsAmount) > 0) {
        setAmount(`${propsAmount}`)
      }

      if (recipientAddress?.length) {
        setAddress(recipientAddress)
      }

      if (props?.extraId) {
        setExtraId(props.extraId)
      }
    }
  }

  const getStorageData = (): void => {
    const tabInfo = getItem('tab')
    const getProps = getItem('sendPageProps')

    if (tabInfo) {
      const { favIconUrl = undefined, url = undefined } = JSON.parse(tabInfo)

      if (favIconUrl && url) {
        setTabInfo({
          favIconUrl,
          url: new URL(url).host,
        })
      }
      removeItem('tab')
    }

    if (getProps) {
      const parseProps = JSON.parse(getProps)

      setProps(parseProps)
    }
  }

  const getCurrencyInfo = (): void => {
    if (selectedWallet) {
      const info = selectedWallet?.chain
        ? getToken(selectedWallet?.symbol, selectedWallet.chain)
        : getCurrency(selectedWallet?.symbol)

      if (info) {
        setCurrencyInfo(info)
        getOutputs(info)
      }
    }
  }

  const getCurrencyBalance = async (): Promise<void> => {
    setBalance(null)
    setEstimated(null)

    if (selectedWallet) {
      const { address, symbol, chain, contractAddress } = selectedWallet

      const getCurrencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (getCurrencyInfo) {
        const { balance, balance_usd } = await getBalance(
          address,
          getCurrencyInfo?.chain,
          chain ? symbol : undefined,
          contractAddress
        )

        setBalance(balance)
        setEstimated(balance_usd)
      }
    }
  }

  const getWalletsList = (sendPageProps: string | null): void => {
    const wallets = getWallets()

    let currency: undefined | string = undefined
    let chain: undefined | string = undefined

    if (sendPageProps) {
      const parsePageProps = JSON.parse(sendPageProps)

      if (parsePageProps?.currency) {
        currency = parsePageProps.currency
      }

      if (parsePageProps?.chain) {
        chain = parsePageProps.chain
      }
    }

    if (wallets?.length) {
      if (currency) {
        const filterWallets = wallets.filter(
          (wallet: IWallet) =>
            toLower(wallet.symbol) === toLower(currency) && toLower(wallet.chain) === toLower(chain)
        )

        if (filterWallets.length) {
          setWalletsList(filterWallets)
          setSelectedWallet(filterWallets[0])
        } else {
          setWalletsList(wallets)
          setSelectedWallet(null)
        }
      } else {
        setWalletsList(wallets)
        setSelectedWallet(wallets[0])
      }
    }
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })

    window.close()
  }

  const onConfirm = async (): Promise<void> => {
    const currenctTab = await getCurrentTab()

    const url = getUrl('send-confirmation.html')

    if (currenctTab?.id && selectedWallet) {
      const currency = selectedWallet?.chain
        ? getToken(selectedWallet.symbol, selectedWallet.chain)
        : getCurrency(selectedWallet.symbol)

      const data = {
        amount: Number(amount),
        symbol: selectedWallet.symbol,
        addressFrom: selectedWallet.address,
        addressTo: address,
        networkFee,
        tabInfo,
        chain: currency?.chain,
        networkFeeSymbol,
        outputs: utxosList,
        contractAddress: selectedWallet?.contractAddress,
        tokenChain: selectedWallet?.chain,
        decimals: selectedWallet?.decimals,
        extraId,
      }

      setItem('sendConfirmationData', JSON.stringify(data))

      if (isDraggable) {
        location.href = `${url}?isDraggable=true`
      } else {
        await updateTab(currenctTab.id, {
          url,
        })
      }
    }
  }

  const dropdownList = walletsList
    ?.filter(
      (wallet: IWallet) =>
        toLower(wallet.address) !== toLower(selectedWallet?.address) ||
        toLower(wallet?.chain) !== toLower(selectedWallet?.chain)
    )
    .map((wallet: IWallet) => {
      const currencyInfo = wallet?.chain
        ? getCurrencyByChain(wallet.chain)
        : getCurrency(wallet?.symbol)

      return {
        logo: {
          symbol: wallet.symbol,
          width: 40,
          height: 40,
          br: 13,
          background: currencyInfo?.background,
          chain: wallet?.chain,
        },
        label: wallet?.name || currencyInfo?.name,
        value: wallet.address,
        chain: wallet?.chain,
      }
    })

  const onSelectDropdown = (index: number) => {
    const currency = dropdownList[index]

    const findWallet = walletsList.find(
      (wallet: IWallet) =>
        toLower(wallet.address) === toLower(currency.value) &&
        toLower(wallet?.chain) === toLower(currency?.chain)
    )

    if (findWallet) {
      setSelectedWallet(findWallet)
    }
  }

  const checkValidAddress = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (selectedWallet && currencyInfo) {
      if (
        address.length &&
        !validateAddress(selectedWallet.symbol, currencyInfo.chain, address, selectedWallet?.chain)
      ) {
        return setAddressErrorLabel('Address is not valid')
      }

      if (address === selectedWallet.address) {
        return setAddressErrorLabel('Address same as sender')
      }
    }

    if (!networkFee && Number(amount) > 0 && !amountErrorLabel) {
      getNetworkFee()
    }
  }

  const getAvailableBalance = (): number => {
    if (balance && selectedWallet) {
      if (toLower(selectedWallet?.symbol) === 'xrp') {
        return new BigNumber(balance).minus(20).toNumber()
      }
      return Number(balance)
    }
    return 0
  }

  const onBlurAmountInput = (): void => {
    if (amountErrorLabel) {
      setAmountErrorLabel(null)
    }

    const availableBalance = getAvailableBalance()

    if (amount.length && Number(amount) + Number(networkFee) >= Number(availableBalance)) {
      return setAmountErrorLabel('Insufficient funds')
    }

    if (currencyInfo && selectedWallet) {
      let parseAmount: number = Number(amount)
      let parseMinAmount: number = 0

      if (selectedWallet?.chain) {
        parseMinAmount = currencyInfo.minSendAmount || 0.001
      } else {
        parseAmount = formatUnit(selectedWallet.symbol, amount, 'to', currencyInfo.chain, 'ether')
        parseMinAmount = formatUnit(
          selectedWallet.symbol,
          currencyInfo.minSendAmount,
          'from',
          currencyInfo.chain,
          'ether'
        )
      }

      if (parseAmount < currencyInfo.minSendAmount) {
        return setAmountErrorLabel(
          `Min amount is ${parseMinAmount} ${toUpper(selectedWallet.symbol)}`
        )
      }
    }
  }

  const isCurrencyBalanceError =
    selectedWallet &&
    (selectedWallet?.chain || toLower(selectedWallet.symbol) === 'theta') &&
    currencyBalance !== null &&
    !isNetworkFeeLoading &&
    networkFee &&
    networkFee > currencyBalance

  const isButtonDisabled = (): boolean => {
    if (selectedWallet && currencyInfo) {
      if (
        validateAddress(
          selectedWallet.symbol,
          currencyInfo.chain,
          address,
          selectedWallet?.chain
        ) &&
        amount.length &&
        Number(amount) > 0 &&
        addressErrorLabel === null &&
        amountErrorLabel === null &&
        Number(balance) > 0 &&
        networkFee > 0 &&
        !isNetworkFeeLoading &&
        !isCurrencyBalanceError
      ) {
        if (!outputs.length) {
          if (
            bitcoinLike.coins().indexOf(currencyInfo.chain) !== -1 ||
            toLower(selectedWallet.symbol) === 'ada'
          ) {
            return true
          }
        }
        return false
      }
    }
    return true
  }

  const createExtraId = (): void => {
    if (selectedWallet) {
      const newExtraId = generateExtraId(selectedWallet.symbol)

      if (newExtraId) {
        setExtraId(newExtraId)
      }
    }
  }

  const extraIdInputButton = () => (
    <Tooltip text="Generate destination tag" direction="right">
      <Styles.InputButton onClick={createExtraId} withHover>
        <SVG src="../../assets/icons/generateExtraid.svg" width={16} height={16} />
      </Styles.InputButton>
    </Tooltip>
  )

  const amountInputButton = () => {
    if (selectedWallet) {
      if (toLower(selectedWallet.symbol) === 'xrp' && amountErrorLabel === 'Insufficient funds') {
        return (
          <Tooltip
            text="The network requires at least 20 XRP balance at all times."
            direction="right"
            maxWidth={195}
            textSpace="pre-wrap"
          >
            <Styles.InputButton disabled>
              <SVG src="../../assets/icons/info.svg" width={16} height={16} />
            </Styles.InputButton>
          </Tooltip>
        )
      }
    }

    return null
  }

  const withExtraid = extraIdName.length > 0

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={isDraggable}>
      <Styles.Body>
        <Styles.Heading withExtraid={withExtraid}>
          <Styles.TitleRow>
            <Styles.Title>Send it on</Styles.Title>
            {tabInfo ? (
              <Styles.SiteInfo>
                <Styles.SiteFavicon src={tabInfo.favIconUrl} />
                <Styles.SiteUrl>{tabInfo.url}</Styles.SiteUrl>
              </Styles.SiteInfo>
            ) : null}
          </Styles.TitleRow>
          <Skeleton
            width={250}
            height={42}
            type="gray"
            mt={31}
            isLoading={balance === null || !selectedWallet}
          >
            <Styles.Balance>
              {numeral(balance).format('0.[000000]')} {toUpper(selectedWallet?.symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton
            width={130}
            height={23}
            mt={10}
            type="gray"
            isLoading={estimated === null || !selectedWallet}
          >
            <Styles.Estimated>{`$ ${formatEstimated(
              estimated,
              price(estimated, 2)
            )}`}</Styles.Estimated>
          </Skeleton>
        </Styles.Heading>
        <Styles.Form>
          {walletsList.length ? (
            <CurrenciesDropdown
              list={dropdownList}
              onSelect={onSelectDropdown}
              currencyBr={13}
              label="Select address"
              value={selectedWallet?.address}
              currencySymbol={selectedWallet?.symbol}
              background={currencyInfo?.background}
              disabled={walletsList.length < 2}
              tokenChain={props?.chain}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={setAddress}
            openFrom="browser"
            errorLabel={addressErrorLabel}
            onBlurInput={checkValidAddress}
            disabled={balance === null || props?.readOnly}
            type="text"
          />
          {withExtraid ? (
            <TextInput
              label={`${extraIdName} (optional)`}
              value={extraId}
              onChange={setExtraId}
              disabled={balance === null}
              button={extraIdInputButton()}
              type="text"
            />
          ) : null}
          <TextInput
            label={`Amount ${selectedWallet ? `(${toUpper(selectedWallet?.symbol)})` : ''}`}
            value={amount}
            onChange={setAmount}
            type="number"
            openFrom="browser"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={props?.readOnly}
            button={amountInputButton()}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} size={16} />
            ) : (
              <>
                {networkFee === 0 ? (
                  <Styles.NetworkFee>-</Styles.NetworkFee>
                ) : (
                  <Styles.NetworkFee>
                    {networkFee} {toUpper(networkFeeSymbol)}
                  </Styles.NetworkFee>
                )}
              </>
            )}
            {isCurrencyBalanceError ? (
              <Styles.NetworkFeeError>
                Insufficient funds {Number(networkFee - currencyBalance)}{' '}
                {toUpper(networkFeeSymbol)}
              </Styles.NetworkFeeError>
            ) : null}
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Send" disabled={isButtonDisabled()} onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<Send />, document.getElementById('send'))
