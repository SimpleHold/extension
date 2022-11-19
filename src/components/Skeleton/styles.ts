import styled, { keyframes } from 'styled-components'

type TContainerProps = {
  type: 'light' | 'gray'
  height: number
  width?: number
  mt?: number
  br: number
  mb?: number
}

const linearAnimation = ({ width }: TContainerProps) => keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: ${width}px 0px;
  }
`

const getBackground = (type: 'light' | 'gray'): string => {
  if (type === 'light') {
    // return '90deg, rgba(255,255,255,0.4) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.4) 100%' // Seamless
    return '90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.6) 100%'
  }
  return '90deg, #F2F4F8 0%, #F2F4F8 70%, #EBEDF2 100%'
}

const Container = styled.div`
  width: ${({ width }: TContainerProps) => (width ? `${width}px` : 'auto')};
  height: ${({ height }: TContainerProps) => `${height}px`};
  margin-top: ${({ mt }: TContainerProps) => (mt ? `${mt}px` : '0')};
  margin-bottom: ${({ mb }: TContainerProps) => (mb ? `${mb}px` : '0')};
  background: ${({ type }: TContainerProps) => `linear-gradient(${getBackground(type)})`};
  border-radius: ${({ br }: TContainerProps) => `${br}px`};
  animation: ${linearAnimation} 1.1s infinite linear;
`

const Styles = {
  Container,
}

export default Styles
