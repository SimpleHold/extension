import styled from 'styled-components'

type TProgressDotProps = {
  isCurrent: boolean
  theme: 'simplehold' | 'swapspace'
}

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
      theme === 'swapspace' ? '240px 30px 0 30px' : '40px 30px 0 30px'};
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

const Illustrate = styled.img``

const Title = styled.p`
  margin: 40px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-transform: capitalize;
  text-align: center;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
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

const ProgressDot = styled.div`
  width: ${({ isCurrent }: TProgressDotProps) => (isCurrent ? '20px' : '6px')};
  height: 6px;
  background-color: ${({ isCurrent, theme }: TProgressDotProps) =>
    isCurrent ? themes[theme].currentDotColor : themes[theme].nextDotColor};
  border-radius: 5px;
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
  ProgressDot,
}

export default Styles
