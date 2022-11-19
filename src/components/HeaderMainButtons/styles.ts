import styled from 'styled-components'

type TProps = {
  isCollapsed?: boolean
}

const Animations = styled.div`
  width: 100%;
  position: absolute;
  left: 29px;
  top: 150px;

  .buttons-enter {
    opacity: 0;
  }

  .buttons-enter-active {
    opacity: 1;
    transition: all 400ms;
  }

  .buttons-exit {
    opacity: 1;
  }

  .buttons-exit-active {
    opacity: 0;
    transition: all 200ms;
  }
`

const Container = styled.div`
  position: absolute;
  top: 45px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;

  width: 315px;
  height: 64px;

  background: rgba(49, 167, 108, 0.5);
  border-radius: 16px;
`

const ControlsLeft = styled.div``

const ControlsRight = styled.div`
  display: flex;
`

const Button = styled.div`
  width: 105px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 42px 10px;
  cursor: pointer;
  :hover {
    transition: 0.2s ease;
    transform: scale(1.04);
  }
`

const Icon = styled.img``

const Label = styled.span`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #ffffff;
`

const Styles = {
  Animations,
  Container,
  Button,
  Icon,
  Label,
  ControlsLeft,
  ControlsRight,
}

export default Styles
