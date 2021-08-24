import styled, { keyframes } from 'styled-components'

const linearAnimation = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 250px 0px;
  }
`

type TContainerProps = {
  type: 'light' | 'gray'
  width: number
  height: number
  mt?: number
  br: number
  mb?: number
}

const getBackground = (type: 'light' | 'gray'): string => {
  if (type === 'light') {
    return '270deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%'
  }
  return '270deg, #EBEDF2 0%, #F2F4F8 100%'
}

const Container = styled.div`
  width: ${({ width }: TContainerProps) => `${width}px`};
  height: ${({ height }: TContainerProps) => `${height}px`};
  margin-top: ${({ mt }: TContainerProps) => (mt ? `${mt}px` : '0')};
  margin-bottom: ${({ mb }: TContainerProps) => (mb ? `${mb}px` : '0')};
  background: ${({ type }: TContainerProps) => `linear-gradient(${getBackground(type)})`};
  border-radius: ${({ br }: TContainerProps) => `${br}px`};
  animation: ${linearAnimation} 1s infinite linear;
`

const Styles = {
  Container,
}

export default Styles
