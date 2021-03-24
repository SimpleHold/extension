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

const TotalBalanceLabel = styled.p`
  margin: 0px;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
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

const ClockIconRow = styled.div`
  margin: 0 0 0 5px;
`

const Estimated = styled.p`
  color: rgba(255, 255, 255, 0.8);
`

const AddWalletBlock = styled.div`
  padding: 16px 30px 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AddWalletLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
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

const Styles = {
  Container,
  Row,
  TotalBalanceLabel,
  BalanceRow,
  Balance,
  ClockIconRow,
  Estimated,
  AddWalletBlock,
  AddWalletLabel,
  AddWalletButton,
}

export default Styles
