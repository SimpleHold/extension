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

const AddWallet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: calc(100% - 60px);
  bottom: 10px;
`

const AddWalletLabel = styled.p`
  margin: 0;
`

const AddWalletButton = styled.button`
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  &:hover {
    cursor: pointer;
    background-color: #ffffffcc;

    line {
      stroke: #31a76c;
    }
  }
`

const TotalBalanceLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  position: absolute;
`

const PendingBalanceRow = styled.div``

const Styles = {
  Container,
  Row,
  BalanceRow,
  Balance,
  ClockIcon,
  Estimated,
  AddWallet,
  AddWalletLabel,
  AddWalletButton,
  TotalBalanceLabel,
  PendingBalanceRow,
}

export default Styles
