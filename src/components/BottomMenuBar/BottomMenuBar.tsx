import * as React from 'react'

// Styles
import Styles from './styles'

// Assets
import walletsIcon from '@assets/icons/bottomBar/wallet.svg'
import swapIcon from '@assets/icons/bottomBar/swap.svg'
import historyIcon from '@assets/icons/bottomBar/book.svg'
import settingsIcon from '@assets/icons/bottomBar/settings.svg'
import SVG from 'react-inlinesvg'

interface Props {
  onViewTxHistory: () => void
  onOpenSettings: () => void
  onClickWallets: () => void
  onClickSwap: () => void
}

type TTabTitle = 'wallets' | 'swap' | 'history' | 'settings'

type TTab = {
  title: TTabTitle
  icon: string
  onClick: () => void
}

const BottomMenuBar: React.FC<Props> = (props) => {
  const [activeTab, setActiveTab] = React.useState<TTabTitle>('wallets')

  const { onClickWallets, onClickSwap, onViewTxHistory, onOpenSettings } = props

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

  const tabs: TTab[] = [
    {
      title: 'wallets',
      icon: walletsIcon,
      onClick: onWallets,
    },
    {
      title: 'swap',
      icon: swapIcon,
      onClick: onSwap,
    },
    {
      title: 'history',
      icon: historyIcon,
      onClick: onHistory,
    },
    {
      title: 'settings',
      icon: settingsIcon,
      onClick: onSettings,
    },
  ]

  return (
    <Styles.Container>
      {tabs.map((tab) => {
        const { title, icon, onClick } = tab
        const isActive = activeTab === title

        return (
          <Styles.Button key={`${title}`} onClick={onClick} isActive={isActive}>
            <SVG src={icon} width={24} height={24} />
            <Styles.Label isActive={isActive}>{title}</Styles.Label>
          </Styles.Button>
        )
      })}
    </Styles.Container>
  )
}

export default BottomMenuBar
