import styled from 'styled-components'

import background from '../../assets/backgrounds/main.png'

const Wrapper = styled.div`
  height: 600px;
`

const Collapsible = styled.div`
  width: 100%;
  background-image: url(${background});
  background-repeat: no-repeat;
  position: fixed;
  z-index: 2;
`

const WalletsList = styled.div`
  position: relative;
  top: 300px;
  padding: 0 30px 20px 30px;
`

const BalanceBlock = styled.div`
  position: absolute;
  padding-right: 30px;
  padding-left: 30px;
`

const TotalBalance = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`

const BalanceAmount = styled.p`
  margin: 21px 0 0 0;
  font-weight: 500;
  /* font-size: 36px;
  line-height: 42px; */
  color: #ffffff;
`

const USDEstimated = styled.p`
  margin: 5px 0 0 0;
  /* font-size: 20px;
  line-height: 23px; */
  color: #ffffff;
`

const WalletsHeading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 30px;
  margin: 70px 0 0 0;
  align-items: center;
`

const WalletsLabel = styled.p`
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
  Wrapper,
  Collapsible,
  WalletsList,
  BalanceBlock,
  TotalBalance,
  BalanceAmount,
  USDEstimated,
  WalletsHeading,
  WalletsLabel,
  AddWalletButton,
}

export default Styles
