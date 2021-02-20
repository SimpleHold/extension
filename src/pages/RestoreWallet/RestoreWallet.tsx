import * as React from 'react'
import CryptoJS from 'crypto-js'

// Components
import Header from '@components/Header'

// Styles
import Styles from './styles'

interface Props {
  params: string
}

const RestoreWallet: React.FC<Props> = (props) => {
  const { params } = props

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files.item(0)
    const text = await file.text()

    console.log('text', text)

    const bytes = CryptoJS.AES.decrypt(text, '1122334455667788')
    const originalText = bytes.toString(CryptoJS.enc.Utf8)

    console.log('originalText', originalText)
  }

  return (
    <Styles.Wrapper>
      <Header noActions withName logoColor="#3FBB7D" />
      <input type="file" onChange={onChange} />
    </Styles.Wrapper>
  )
}

export default RestoreWallet
