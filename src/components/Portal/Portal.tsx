import * as React from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
}

const Portal: React.FC<Props> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false)
  const ref: any = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    ref.current = document.createElement('div')
    ref.current.setAttribute('id', 'popup')
    document.body.appendChild(ref.current)

    setMounted(true)

    return () => {
      document.body.removeChild(ref.current)
    }
  }, [])

  return mounted ? createPortal(children, ref.current) : null
}

export default Portal
