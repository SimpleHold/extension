import styled from 'styled-components'

type TThemeProps = {
  theme: 'simplehold' | 'swapspace'
}

type TThemeConfig = {
  [key: string]: {
    background: string
    textColor: string
    descriptionColor: string
    nextColor: string
    currentDotColor: string
    nextDotColor: string
  }
}

const themes: TThemeConfig = {
  simplehold: {
    background: '#ffffff',
    textColor: '#1d1d22',
    descriptionColor: '#7D7E8D',
    nextColor: '#3fbb7d',
    currentDotColor: '#3FBB7D',
    nextDotColor: '#D3ECDD',
  },
  swapspace: {
    background: 'linear-gradient(180deg, #201F21 0%, #4D374D 100%)',
    textColor: '#FFFFFF',
    descriptionColor: '#FFFFFF',
    nextColor: '#E35760',
    currentDotColor: '#E35760',
    nextDotColor: 'rgba(227, 87, 96, 0.3)',
  },
}

const Wrapper = styled.div`
  height: 600px;
  background: ${({ theme }: TThemeProps) => themes[theme].background};
  overflow: hidden;

  .title {
    color: ${({ theme }: TThemeProps) => themes[theme].textColor};
  }

  .description {
    color: ${({ theme }: TThemeProps) => themes[theme].descriptionColor};
  }

  .next {
    color: ${({ theme }: TThemeProps) => themes[theme].nextColor};
  }

  .arrow {
    svg {
      path {
        fill: ${({ theme }: TThemeProps) => themes[theme].nextColor};
      }
    }
  }

  .container {
    padding: ${({ theme }: TThemeProps) =>
            theme === 'swapspace' ? '240px 30px 0 30px' : '20px 30px 0 30px'};
  }

  .slide {
    width: ${({ theme }: TThemeProps) => (theme === 'swapspace' ? '375px' : '315px')};
    height: ${({ theme }: TThemeProps) => (theme === 'swapspace' ? '315px' : '180px')};
    position: ${({ theme }: TThemeProps) => (theme === 'swapspace' ? 'absolute' : 'relative')};
    top: ${({ theme }: TThemeProps) => (theme === 'swapspace' ? '0' : 'initial')};
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 540px;
  margin: 60px 0 0 0;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Illustrate = styled.img`
  width: 230px;
  height: 200px;
`

const Title = styled.p`
  width: 200px;
  margin: 12px 0 0 0;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 27px;
  text-align: center;
  color: #1D1D22;
`

const Description = styled.p`
  margin: 10px 0;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  color: #74758C;
`

const Footer = styled.div`
  padding: 0 0 30px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Progress = styled.div`
  width: 52px;
  height: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const NextBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const NextLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`

const ArrowIconRow = styled.div`
  margin: 0 0 0 10px;

  svg {
    transform: rotate(180deg);
  }
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 108px;

  .button {
    border: none;
    border-radius: 12px;

    &:hover {
      border: none;
      opacity: 0.8;
    }

    .label {
      font-family: Inter, sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 21px;
      text-align: center;
    }
  }

  > div .button {
    background-color: #F2F4F8;

    .label {
      color: #3FBB7D;
    }
  }
`

const RestoreButtonContainer = styled.div`
  &:hover {
    .action-text {
      opacity: 1;
    }
  }
`

const HoverActionText = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
  opacity: 0;
  user-select: none;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  transition: 0.2s ease;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Illustrate,
  Title,
  Description,
  Footer,
  Progress,
  NextBlock,
  NextLabel,
  ArrowIconRow,
  Buttons,
  RestoreButtonContainer,
  HoverActionText,
}

export default Styles
