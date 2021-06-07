import styled from 'styled-components'

type TContainerProps = {
  width: number
  height: number
}

type TLogoRowProps = {
  width: number
  height: number
  background?: string
  br?: number
}

const Container = styled.div`
  position: relative;
  width: ${({ width }: TContainerProps) => `${width}px`};
  min-width: ${({ width }: TContainerProps) => `${width}px`};
  height: ${({ height }: TContainerProps) => `${height}px`};
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
`

const LogoRow = styled.div`
  width: ${({ width }: TLogoRowProps) => `${width}px`};
  height: ${({ height }: TLogoRowProps) => `${height}px`};
  background: ${({ background }: TLogoRowProps) =>
    `linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 100%), ${background};`};
  border-radius: ${({ br }: TLogoRowProps) => (br ? `${br}px` : '13px')};
  display: flex;
  align-items: center;
  justify-content: center;
`

const TokenRow = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid #ffffff;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%),
    #1d1d22;
  border-radius: 10px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TokenLogo = styled.img`
  width: 10px;
  height: 10px;
`

const LetterLogo = styled.span`
  font-size: 23px;
  line-height: 27px;
  text-transform: capitalize;
  color: #ffffff;
`

const Logo = styled.img``

const Styles = {
  Container,
  LogoRow,
  TokenRow,
  TokenLogo,
  LetterLogo,
  Logo,
}

export default Styles
