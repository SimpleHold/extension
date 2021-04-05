import styled from 'styled-components'

type TContainerProps = {
  width: number
  height: number
  background: string
  br?: number
}

type TLogoProps = {
  source: string
  width: number
  height: number
}

type TPlatformLogoProps = {
  source: string
}

const Container = styled.div`
  width: ${({ width }: TContainerProps) => `${width}px`};
  min-width: ${({ width }: TContainerProps) => `${width}px`};
  height: ${({ height }: TContainerProps) => `${height}px`};
  background: ${({ background }: TContainerProps) =>
    `linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 100%), ${background};`};
  border-radius: ${({ br }: TContainerProps) => (br ? `${br}px` : '13px')};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Logo = styled.div<TLogoProps>`
  background-image: ${({ source }: TLogoProps) => `url(${source})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: ${({ width }: TLogoProps) => `${width / 2}px`};
  height: ${({ height }: TLogoProps) => `${height / 2}px`};
`

const LogoRow = styled.div``

const PlatformLogoRow = styled.div`
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%),
    #1d1d22;
  border: 1px solid #ffffff;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlatformLogo = styled.div`
  background-image: ${({ source }: TPlatformLogoProps) => `url(${source})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: 10px;
  height: 10px;
`

const Styles = {
  Container,
  Logo,
  LogoRow,
  PlatformLogoRow,
  PlatformLogo,
}

export default Styles
