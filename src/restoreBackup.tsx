import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles/restoreBackup.page'

const RestoreBackup: React.FC = () => {
  const onClose = (): void => {
    window.close()
  }

  return (
    <Styles.Wrapper>
      <Styles.Extension>
        <Styles.Header>
          <Styles.LogoRow>
            <SVG src="./assets/logo.svg" width={30} height={24} />
          </Styles.LogoRow>
          <Styles.CloseIconRow onClick={onClose}>
            <SVG src="./assets/icons/times.svg" width={15} height={15} />
          </Styles.CloseIconRow>
        </Styles.Header>
        <Styles.Body>
          <Styles.Title>Restore</Styles.Title>

          <Styles.DNDArea></Styles.DNDArea>
        </Styles.Body>
      </Styles.Extension>
    </Styles.Wrapper>
  )
}

render(<RestoreBackup />, document.getElementById('restore-backup'))
