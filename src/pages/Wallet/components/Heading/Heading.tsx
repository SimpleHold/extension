import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DropDown from '@components/DropDown'

// Hooks
import useVisible from '@hooks/useVisible'

// Assets
import moreIcon from '@assets/icons/more.svg'
import privateKeyIcon from '@assets/icons/privateKey.svg'
import plusCircleIcon from '@assets/icons/plusCircle.svg'
import phraseIcon from '@assets/icons/phrase.svg'
import linkIcon from '@assets/icons/link.svg'
import renameIcon from '@assets/icons/rename.svg'
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'
import eyeIcon from '@assets/icons/eye.svg'
import eyeVisibleIcon from '@assets/icons/eyeVisible.svg'

// Types
import { TDropdowbList } from '@components/DropDown/DropDown'
import { THardware } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  onSelectDropdown: (index: number) => void
  withPhrase: boolean
  walletName: string
  onRenameWallet: () => void
  isHidden: boolean
  hardware?: THardware
}

const WalletHeading: React.FC<Props> = (props) => {
  const {
    symbol,
    onSelectDropdown,
    withPhrase,
    walletName,
    onRenameWallet,
    isHidden,
    hardware,
  } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const [dropdownList, setDropdownList] = React.useState<TDropdowbList[]>([])

  React.useEffect(() => {
    getDropdownList()
  }, [isHidden])

  const getDropdownList = (): void => {
    const list: TDropdowbList[] = []

    if (withPhrase) {
      list.push({
        icon: {
          source: phraseIcon,
          width: 16,
          height: 16,
        },
        title: 'Show recovery phrase',
      })
    } else {
      list.push({
        icon: {
          source: privateKeyIcon,
          width: 18,
          height: 18,
        },
        title: 'Show Private key',
      })
    }

    list.push(
      { icon: { source: linkIcon, width: 16, height: 16 }, title: 'View in Explorer' },
      {
        icon: { source: isHidden ? eyeVisibleIcon : eyeIcon, width: 30, height: 30 },
        title: `${isHidden ? 'Show' : 'Hide'} address`,
      }
    )

    if (['eth', 'bnb'].indexOf(symbol) !== -1 && !hardware) {
      list.push({
        icon: { source: plusCircleIcon, width: 18, height: 18 },
        title: 'Add token',
      })
    }

    setDropdownList(list)
  }

  const toggleDropdownVisible = (): void => {
    setIsVisible(!isVisible)
  }

  const onClickDropDown = (index: number): void => {
    toggleDropdownVisible()
    onSelectDropdown(index)
  }

  const onRename = (): void => {
    if (!hardware) {
      onRenameWallet()
    }
  }

  return (
    <Styles.Container>
      <Styles.RenameBlock onClick={onRename} isDisabled={hardware !== undefined}>
        {hardware ? (
          <Styles.HardwareIcon>
            <SVG
              src={hardware.type === 'ledger' ? ledgerLogo : trezorLogo}
              width={14}
              height={14}
            />
          </Styles.HardwareIcon>
        ) : null}

        <Styles.WalletName>{walletName}</Styles.WalletName>
        {!hardware ? <SVG src={renameIcon} width={9} height={11} /> : null}
      </Styles.RenameBlock>
      <Styles.MoreButton onClick={toggleDropdownVisible}>
        <SVG src={moreIcon} width={16} height={3.36} />
      </Styles.MoreButton>

      <DropDown
        dropDownRef={ref}
        isVisible={isVisible}
        list={dropdownList}
        onClick={onClickDropDown}
      />
    </Styles.Container>
  )
}

export default WalletHeading
