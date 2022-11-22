import * as React from 'react'

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
    (toast: string) => {
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
            <Styles.CloseIconRow onClick={() => setToast('')} />
          </Styles.Toast>
        </Styles.Container>
      ) : null}
    </ToastContext.Provider>
  )
}
