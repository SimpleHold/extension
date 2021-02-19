import styled from 'styled-components'

type TContainerProps = {
  width: number
  height: number
}

type TLogoProps = {
  source: string
}

const Container = styled.div`
  width: ${({ width }: TContainerProps) => `${width}px`};
  height: ${({ height }: TContainerProps) => `${height}px`};
  background: #f7931a33;
  border-radius: 5px;
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
`

const Styles = {
  Container,
  Logo,
}

export default Styles
