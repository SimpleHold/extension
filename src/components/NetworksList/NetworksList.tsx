import * as React from 'react'

// Config
import networks, { TNetwork, NOT_ETH_NETWORKS, ALL_NETWORK } from '@config/networks'

// Styles
import Styles from './styles'

interface Props {
  activeKey: string
  setActiveKey: (key: string) => void
}

const NetworksList: React.FC<Props> = (props) => {
  const { activeKey, setActiveKey } = props

  const networksList = [ALL_NETWORK, ...networks, ...NOT_ETH_NETWORKS]

  const onClickNetwork = (chain: string) => (): void => {
    if (chain !== activeKey) {
      setActiveKey(chain)
    }
  }

  return (
    <Styles.Container>
      {networksList.map((network: TNetwork) => {
        const { name, chain } = network
        const isActive = activeKey === chain

        return (
          <Styles.Network
            key={chain}
            className={isActive ? 'active' : ''}
            onClick={onClickNetwork(chain)}
          >
            <Styles.NetworkName>{name}</Styles.NetworkName>
          </Styles.Network>
        )
      })}
    </Styles.Container>
  )
}

export default NetworksList
