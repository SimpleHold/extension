import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { validateUrl } from '@utils/validate'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  updateImage: (image: string) => void
}

const AddImageDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, updateImage } = props

  const [url, setUrl] = React.useState<string>('')

  const onAddImage = (): void => {
    updateImage(url)
  }

  return (
    <DrawerWrapper
      title="Add an image manually"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
    >
      <Styles.Row>
        <Styles.Hint>Copy and paste NFT's image URL to add an image</Styles.Hint>
        <Styles.Form>
          <TextInput label="Paste URL" type="text" value={url} onChange={setUrl} />
          <Button label="Add" onClick={onAddImage} disabled={!validateUrl(url)} />
        </Styles.Form>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default AddImageDrawer
