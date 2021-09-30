import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'
import GroupDropdown from '@components/GroupDropdown'
import SelectedWallets from '@drawers/HistoryFilter/components/SelectedWallets'
import Wallet from '@drawers/HistoryFilter/components/Wallet'

// Utils
import { IWallet, getWallets, getWalletName } from '@utils/wallet'
import { getItem, checkOneOfExist, removeItem, setItem, removeMany } from '@utils/storage'
import { toLower } from '@utils/format'

// Assets
import ethLogo from '@assets/currencies/eth.svg'
import bscLogo from '@assets/currencies/bnb.svg'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  onApply: () => void
}

type TNetwork = {
  title: string
  key: string
  icon?: string
}

const networks: TNetwork[] = [
  {
    title: 'All',
    key: 'all',
  },
  {
    title: 'Ethereum',
    key: 'eth',
    icon: ethLogo,
  },
  {
    title: 'BSC',
    key: 'bsc',
    icon: bscLogo,
  },
]

const HistoryFilterDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onApply } = props

  const [activeNetworkType, setNetworkType] = React.useState<string>('all')
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [selectedWallets, setSelectedWallets] = React.useState<IWallet[]>([])
  const [isWalletsVisible, setWalletsVisible] = React.useState<boolean>(false)

  React.useEffect(() => {
    onGetWallets()
  }, [])

  React.useEffect(() => {
    setSelectedWallets([])
  }, [activeNetworkType])

  React.useEffect(() => {
    if (isActive) {
      checkActiveFilters()
    }
  }, [isActive])

  const checkActiveFilters = (): void => {
    const getNetwork = getItem('nftFiltersNetwork')
    const getAddresses = getItem('nftFiltersAddresses')

    if (getNetwork) {
      const findNetwork = networks.find((network: TNetwork) => network.key === getNetwork)

      if (findNetwork) {
        setNetworkType(findNetwork.key)
      }
    } else {
      setNetworkType('all')
    }

    setSelectedWallets(getAddresses?.length ? JSON.parse(getAddresses) : [])
  }

  const onGetWallets = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallet = walletsList.filter(
        (wallet: IWallet) => wallet.symbol === 'eth' || wallet.symbol === 'bnb'
      )

      setWallets(filterWallet)
    }
  }

  const onApplyFilters = (): void => {
    if (activeNetworkType !== 'all') {
      setItem('nftFiltersNetwork', activeNetworkType)
    } else {
      removeItem('nftFiltersNetwork')
    }

    if (selectedWallets.length) {
      setItem('nftFiltersAddresses', JSON.stringify(selectedWallets))
    } else {
      removeItem('nftFiltersAddresses')
    }

    onApply()
  }

  const setNetwork = (type: string) => (): void => {
    setNetworkType(type)
  }

  const onResetWallets = (): void => {
    setSelectedWallets([])
  }

  const onRemoveWallet = (uuid: string) => (): void => {
    const list = selectedWallets.filter((item: IWallet) => item.uuid !== uuid)
    setSelectedWallets(list)
  }

  const filterWallets = (wallet: IWallet): boolean | IWallet => {
    if (activeNetworkType !== 'all') {
      const formatNetwork = activeNetworkType === 'bsc' ? 'bnb' : activeNetworkType

      return toLower(wallet.symbol) === toLower(formatNetwork)
    }

    return wallet
  }

  const getNameWallet = (wallet: IWallet): string => {
    if (wallet.walletName) {
      return wallet.walletName
    }

    const walletsList = getWallets()

    if (walletsList) {
      const { symbol, uuid, hardware, chain, name } = wallet

      return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
    }

    return ''
  }

  const onToggleAddress = (isActive: boolean, wallet: IWallet) => (): void => {
    if (isActive) {
      const list = selectedWallets.filter((item: IWallet) => item.uuid !== wallet.uuid)
      setSelectedWallets(list)
    } else {
      setSelectedWallets((prev: IWallet[]) => [...prev, wallet])
    }
  }

  const renderAddresses = (
    <>
      {wallets.filter(filterWallets).map((wallet: IWallet) => {
        const { symbol, address, chain, name, uuid } = wallet
        const walletName = getNameWallet(wallet)
        const isActive =
          selectedWallets.find((wallet: IWallet) => wallet.uuid === uuid) !== undefined

        return (
          <Wallet
            key={`${symbol}/${address}/${chain}`}
            symbol={symbol}
            walletName={walletName}
            name={name}
            address={address}
            chain={chain}
            isActive={isActive}
            onToggle={onToggleAddress(isActive, wallet)}
          />
        )
      })}
    </>
  )

  const toggleWalletsDropdown = (isVisible: boolean): void => {
    setWalletsVisible(isVisible)
  }

  const isShowResetButton = (): boolean => {
    return checkOneOfExist(['nftFiltersNetwork', 'nftFiltersAddresses'])
  }

  const onReset = (): void => {
    removeMany(['nftFiltersNetwork', 'nftFiltersAddresses'])
    onApply()
  }

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon height={540}>
      <Styles.Container>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Network</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Styles.NetworksList>
              {networks.map((network: TNetwork) => {
                const { title, key, icon } = network
                const isActive = activeNetworkType === key

                return (
                  <Styles.Network
                    isActive={isActive}
                    key={key}
                    withIcon={typeof icon !== 'undefined'}
                    onClick={setNetwork(key)}
                  >
                    {icon ? (
                      <SVG src={icon} width={18} height={18} style={{ marginRight: 8 }} />
                    ) : null}
                    <Styles.NetworkTitle>{title}</Styles.NetworkTitle>
                  </Styles.Network>
                )
              })}
            </Styles.NetworksList>
          </Styles.Group>

          {wallets.filter(filterWallets).length ? (
            <Styles.Group>
              <Styles.GroupHeading>
                <Styles.GroupTitle>Address</Styles.GroupTitle>
                {selectedWallets.length ? (
                  <Styles.ResetGroup>
                    <Styles.ResetTitle>{selectedWallets.length} selected</Styles.ResetTitle>
                    <Styles.ResetIcon onClick={onResetWallets}>
                      <SVG src="../../assets/icons/times.svg" width={8.33} height={8.33} />
                    </Styles.ResetIcon>
                  </Styles.ResetGroup>
                ) : null}
              </Styles.GroupHeading>
              <GroupDropdown
                title="Select addresses"
                render={renderAddresses}
                maxHeight={150}
                toggle={toggleWalletsDropdown}
                renderRow={
                  selectedWallets.length && !isWalletsVisible ? (
                    <SelectedWallets wallets={selectedWallets} onRemove={onRemoveWallet} />
                  ) : undefined
                }
                hideArrowOnRender
                paddingOnRender="0px"
              />
            </Styles.Group>
          ) : null}
        </Styles.Row>
        <Styles.Actions>
          {isShowResetButton() ? (
            <Button label="Reset" isDanger onClick={onReset} mr={7.5} />
          ) : null}
          <Button label="Apply" onClick={onApplyFilters} ml={isShowResetButton() ? 7.5 : 0} />
        </Styles.Actions>
      </Styles.Container>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer
