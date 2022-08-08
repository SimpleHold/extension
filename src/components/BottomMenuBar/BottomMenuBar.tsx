import * as React from 'react'

// Styles
import Styles from './styles'

// Assets
import walletIcon from '@assets/icons/walletIconNew.svg'
import swapIcon from '@assets/icons/swapIconNew.svg'
import clockIcon from '@assets/icons/clockIconMenu.svg'
import settingsIcon from '@assets/icons/settingsIconNew.svg'
import SVG from 'react-inlinesvg'

interface Props {
  onViewTxHistory: () => void
  onOpenSettings: () => void
  onClickWallets: () => void
  onClickSwap: () => void
}

type TTabs = 'wallets' | 'swap' | 'history' | 'settings'

const BottomMenuBar: React.FC<Props> = (props) => {

  const [activeTab, setActiveTab] = React.useState<TTabs>('wallets')

  const {
    onClickWallets,
    onClickSwap,
    onViewTxHistory,
    onOpenSettings,
  } = props

  const onWallets = () => {
    setActiveTab('wallets')
    onClickWallets()
  }

  const onSwap = () => {
    setActiveTab('swap')
    onClickSwap()
  }

  const onHistory = () => {
    setActiveTab('history')
    onViewTxHistory()
  }

  const onSettings = () => {
    setActiveTab('settings')
    onOpenSettings()
  }

  return (
    <Styles.Container>
      <Styles.Button onClick={onWallets} isActive={activeTab === 'wallets'}>
        <SVG src={walletIcon} width={24} height={24} />
      </Styles.Button>
      <Styles.Button onClick={onSwap} isActive={activeTab === 'swap'}>
        <SVG src={swapIcon} width={24} height={24} />
      </Styles.Button>
      <Styles.Button onClick={onHistory} isActive={activeTab === 'history'}>
        <SVG src={clockIcon} width={24} height={24} />
      </Styles.Button>
      <Styles.Button onClick={onSettings} isActive={activeTab === 'settings'}>
        <SVG src={settingsIcon} width={24} height={24} />
      </Styles.Button>
    </Styles.Container>
  )
}

export default BottomMenuBar
