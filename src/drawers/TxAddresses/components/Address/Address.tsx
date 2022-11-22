import * as React from 'react'
import SVG from 'react-inlinesvg'
import copy from 'copy-to-clipboard'

// Utils
import { short, getFormatEstimated, price } from '@utils/format'

// Assets
import copyIcon from '@assets/icons/copy.svg'
import checkCopyIcon from '@assets/icons/checkCopy.svg'

// Styles
import Styles from './styles'

interface Props {
  address: string
  amount: number
  estimated: number
  symbol: string
}

const Address: React.FC<Props> = (props) => {
  const { address, amount, estimated, symbol } = props

  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  const onCopy = (): void => {
    copy(address)
    setIsCopied(true)
  }

  return (
    <Styles.Container onClick={onCopy}>
      <Styles.Address className="address">{short(address, 28)}</Styles.Address>
      <Styles.Info>
        <Styles.Amount>{`${amount} ${symbol}`}</Styles.Amount>
        <Styles.Estimated>{`$ ${getFormatEstimated(
          estimated,
          price(estimated)
        )}`}</Styles.Estimated>
      </Styles.Info>

      <Styles.Button className="button">
        <SVG src={isCopied ? checkCopyIcon : copyIcon} width={12} height={isCopied ? 11 : 12} />
      </Styles.Button>
    </Styles.Container>
  )
}

export default Address
