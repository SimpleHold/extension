import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Utils
import { IWallet, getWallets } from '@utils/wallet'

// Assets
import ethLogo from '@assets/currencies/eth.svg'
import bscLogo from '@assets/currencies/bnb.svg'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
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
  const { onClose, isActive } = props

  const [activeNetworkType, setNetworkType] = React.useState<string>('all')
  const [wallets, setWallets] = React.useState<IWallet[]>([])

  React.useEffect(() => {
    onGetWallets()
  }, [])

  const onGetWallets = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallet = walletsList.filter(
        (wallet: IWallet) => wallet.symbol === 'eth' || wallet.symbol === 'bnb'
      )

      setWallets(filterWallet)
    }
  }

  const onApply = (): void => {}

  const setNetwork = (type: string) => (): void => {
    setNetworkType(type)
  }

  const onResetWallets = (): void => {
    setWallets([])
  }

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon height={540}>
      <Styles.Container>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Network</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Styles.GroupBody>
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
            </Styles.GroupBody>
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Address</Styles.GroupTitle>
              {wallets.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{wallets.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon onClick={onResetWallets}>
                    <SVG src="../../assets/icons/times.svg" width={8.33} height={8.33} />
                  </Styles.ResetIcon>
                </Styles.ResetGroup>
              ) : null}
            </Styles.GroupHeading>
          </Styles.Group>
        </Styles.Row>
        <Styles.Actions>
          <Button label="Apply" onClick={onApply} />
        </Styles.Actions>
      </Styles.Container>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer
