import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

const ToastContext = React.createContext<any>('')

export default ToastContext

interface Props {
  children: React.ReactElement<any, any> | null
}

export const ToastContextProvider: React.FC<Props> = (props) => {
  const { children } = props

  const [toast, setToast] = React.useState<string>('')

  React.useEffect(() => {
    if (toast.length) {
      const timer = setTimeout(() => setToast(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const addToast = React.useCallback(
    function (toast: string) {
      setToast(toast)
    },
    [setToast]
  )

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toast.length ? (
        <Styles.Container>
          <Styles.Toast>
            <Styles.ToastText>{toast}</Styles.ToastText>
            <Styles.CloseIconRow onClick={() => setToast('')}>
              <SVG src="../../assets/icons/times.svg" width={16} height={16} />
            </Styles.CloseIconRow>
          </Styles.Toast>
        </Styles.Container>
      ) : null}
    </ToastContext.Provider>
  )
}
