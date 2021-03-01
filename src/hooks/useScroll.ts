import * as React from 'react'

export default () => {
  const [scrollPosition, setScrollPosition] = React.useState<number>(0)

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    scrollPosition,
  }
}
