import * as React from 'react'

const useVisible = (initialIsVisible: boolean) => {
  const [isVisible, setIsVisible] = React.useState(initialIsVisible)
  const ref = React.useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsVisible(false)
    }
  }

  const toggle = (): void => {
    setIsVisible((prevValue: boolean) => !prevValue)
  }

  React.useEffect(() => {
    if (isVisible) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isVisible])

  return { ref, isVisible, setIsVisible, toggle }
}

export default useVisible
