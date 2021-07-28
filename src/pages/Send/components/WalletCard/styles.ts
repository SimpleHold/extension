import styled from 'styled-components'

type TVisibleProps = {
  isVisible: boolean
}

const Container = styled.div`
  position: relative;
`

const Row = styled.div`
  padding: 19px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 16px 16px 0 0;
  border: ${({ isVisible }: TVisibleProps) => `1px solid ${isVisible ? '#3fbb7d' : '#ffffff'}`};
`

const Info = styled.div`
  flex: 1;
  margin: 0 0 0 15px;
`

const WalletNameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const WalletName = styled.p`
  margin: 0 6px 0 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
`

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0 0 0;
`

const Balance = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  margin: 0;
`

const Estimated = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const WalletsDropdown = styled.div`
  position: absolute;
  top: 80px;
  border: 1px solid #3fbb7d;
  border-top: none;
  filter: drop-shadow(0px 5px 30px rgba(125, 126, 141, 0.15));
  border-radius: 0 0 16px 16px;
  width: 100%;
  max-height: 290px;
  background-color: #ffffff;
  overflow: scroll;
  opacity: ${({ isVisible }: TVisibleProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TVisibleProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TVisibleProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`

const Styles = {
  Container,
  Row,
  Info,
  WalletNameRow,
  WalletName,
  Balances,
  Balance,
  Estimated,
  WalletsDropdown,
}

export default Styles
