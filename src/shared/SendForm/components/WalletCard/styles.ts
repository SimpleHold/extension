import styled from 'styled-components'

type TRowProps = {
  isVisible: boolean
  disabled: boolean
}

type TVisibleProps = {
  isVisible: boolean
}

const Container = styled.div`
  position: relative;
  user-select: none;
`

const Row = styled.div`
  padding: 19px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 16px 16px 0 0;
  background-color: #ffffff;
  border: ${({ isVisible }: TVisibleProps) => `1px solid ${isVisible ? '#3fbb7d' : '#ffffff'}`};

  &:hover {
    cursor: ${({ disabled, isVisible }: TRowProps) =>
      disabled || isVisible ? 'default' : 'pointer'};
    background-color: ${({ disabled, isVisible }: TRowProps) =>
      disabled || isVisible ? '#FFFFFF' : '#F9FAFC'};
  }
`

const Info = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin: 0 0 0 15px;
  flex: 1;
`

const WalletNameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const WalletName = styled.p`
  margin: 0 6px 0 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
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
  z-index: 2;
  opacity: ${({ isVisible }: TVisibleProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TVisibleProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TVisibleProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`

const HardwareIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px 0 0;

  path {
    fill: #3fbb7d;
  }
`

const Wallet = styled.div`
  overflow: hidden;

  .arrow {
    svg {
      transition: all 0.3s;
      transform: ${({ isVisible }: TVisibleProps) => `rotate(${isVisible ? 180 : 0}deg)`};
    }
  }
`

const Address = styled.p`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  text-overflow: ellipsis;
  overflow: hidden;
`

const DropdownArrow = styled.div`
  min-width: 8px;
  min-height: 5px;
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
  HardwareIcon,
  Wallet,
  Address,
  DropdownArrow,
}

export default Styles
