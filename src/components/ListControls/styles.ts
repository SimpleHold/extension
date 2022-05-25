import styled, { keyframes } from 'styled-components'

type TProps = {
  isCollapsed?: boolean
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: ${({ isCollapsed }: TProps) => isCollapsed ? '0 10px' : '16px 16px'};
  position: ${({ isCollapsed }: TProps) => isCollapsed ? 'fixed' : 'absolute'};
  border-radius: 24px 24px 0px 0px;
  top: ${({ isCollapsed }: TProps) => isCollapsed ? '65px' : 0};
  z-index: 9;
  overflow: hidden;
`

const ControlsLeft = styled.div`

`

const ControlsRight = styled.div`
  display: flex;
`

const Styles = {
  Container,
  ControlsLeft,
  ControlsRight
}

export default Styles
