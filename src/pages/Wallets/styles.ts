import styled from 'styled-components';

const Wrapper = styled.div``;

const Row = styled.div`
  padding: 0 30px;
`;

const BalanceBlock = styled.div`
  margin: 30px 0 0 0;
`;

const TotalBalance = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const BalanceAmount = styled.p`
  margin: 21px 0 3px 0;
  font-weight: 500;
  font-size: 40px;
  line-height: 47px;
  color: #ffffff;
`;

const USDEstimated = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 23px;
  color: #ffffff;
`;

const WalletsRow = styled.div`
  margin: 53px 0 0 0;
`;

const WalletsHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const WalletsLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

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
`;

const Styles = {
  Wrapper,
  Row,
  BalanceBlock,
  TotalBalance,
  BalanceAmount,
  USDEstimated,
  WalletsRow,
  WalletsHeading,
  WalletsLabel,
  AddWalletButton,
};

export default Styles;
