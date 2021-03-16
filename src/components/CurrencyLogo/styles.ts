import styled from 'styled-components'

type TContainerProps = {
  width: number
  height: number
  background: string
  br?: number
}

type TLogoProps = {
  source: string
}

const Container = styled.div`
  width: ${({ width }: TContainerProps) => `${width}px`};
  height: ${({ height }: TContainerProps) => `${height}px`};
  background-color: ${({ background }: TContainerProps) => background};
  border-radius: ${({ br }: TContainerProps) => (br ? `${br}px` : '5px')};
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    width: ${({ width }: TContainerProps) => `${width / 2}px`};
    height: ${({ height }: TContainerProps) => `${height / 2}px`};
  }
`

const Logo = styled.div<TLogoProps>`
  background-image: ${({ source }: TLogoProps) => `url(${source})`};
  background-size: contain;
  background-repeat: no-repeat;
`

const Styles = {
  Container,
  Logo,
}

export default Styles
