import styled from 'styled-components'

type TDrawerProps = {
  openFrom?: string
  padding?: string
  height?: number
  isWindowedMode?: boolean
}

type TBackgroundProps = {
  openFrom?: string
  withoutDimScreen?: boolean
}

const Wrapper = styled.div`
`

const Background = styled.div`
  position: ${({ openFrom, isWindowedMode }: TBackgroundProps & TDrawerProps) => (openFrom === 'browser' || isWindowedMode ? 'absolute' : 'fixed')};
  backdrop-filter: blur(2px);
  z-index: 100;
  background-color: rgba(29, 29, 34, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 250ms;
  border-radius: ${({ openFrom }: TBackgroundProps) => (openFrom === 'browser' ? '16px' : '0')};
  display: ${({ withoutDimScreen }: TBackgroundProps) => withoutDimScreen ? 'none' : 'initial'};;
`

const Drawer = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: ${({ padding }: TDrawerProps) => padding || '30px'};
  word-break: break-word;
  position: ${({ openFrom, isWindowedMode }: TDrawerProps) => (openFrom === 'browser' || isWindowedMode ? 'absolute' : 'fixed')};
  height: ${({ height }: TDrawerProps) => (height ? `${height}px` : 'auto')};
  z-index: 101;
  left: 0;
  bottom: 0;
  width: ${({ openFrom }: TDrawerProps) => (openFrom === 'browser' ? '315px' : '100%')};
  min-width: ${({ isWindowedMode }: TDrawerProps) => (isWindowedMode ? `375px` : 'initial')};
  transition: transform 250ms;
`

const Title = styled.p`
  padding: 0 15px;
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  max-width: 325px;
  margin: 0 auto;
  color: #1d1d22;
`

const IconRow = styled.div`
  margin: 0 0 20px 0;
  display: flex;
  justify-content: center;
`

const Icon = styled.img`
  width: 60px;
  height: 60px;
`

const CloseIconRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 12px;
  right: 12px;

  path {
    fill: #cccccc;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Wrapper,
  Background,
  Drawer,
  Title,
  IconRow,
  Icon,
  CloseIconRow,
}

export default Styles
