import styled from 'styled-components'

import background from '@assets/backgrounds/main.png'

const Container = styled.div`
  width: 100%;
  background-image: url(${background});
  background-repeat: no-repeat;
  position: fixed;
  z-index: 2;
`

const Row = styled.div`
  padding-left: 30px;
  padding-right: 30px;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  color: #ffffff;
`

const ClockIcon = styled.div``

const Estimated = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`

const TotalBalanceLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  position: absolute;
`

const PendingBalanceRow = styled.div``

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 60px);
  justify-content: space-between;
`

const WalletsLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Button = styled.div`
  padding: 8px 11px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s;

  &:not(:last-child) {
    margin: 0 10px 0 0;
  }

  path {
    fill: #ffffff;
  }

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
  Row,
  BalanceRow,
  Balance,
  ClockIcon,
  Estimated,
  TotalBalanceLabel,
  PendingBalanceRow,
  Bottom,
  WalletsLabel,
  Actions,
  Button,
}

export default Styles
