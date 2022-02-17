import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  type: 'light' | 'gray'
  width: number
  height: number
  mt?: number
  br?: number
  isLoading: boolean
  children?: React.ReactElement<any, any> | null
  mb?: number
}

const Skeleton: React.FC<Props> = (props) => {
  const { type, width, height, mt, br = 5, isLoading, children, mb } = props

  if (isLoading) {
    return <Styles.Container type={type}
                             width={width}
                             height={height}
                             mt={mt}
                             br={br}
                             mb={mb}/>
  }

  return children || null
}

export default Skeleton
