import styled from 'styled-components'

import connectImage from '@assets/illustrate/connectLedger.svg'

type TContainerProps = {
  pt: number
}

type TCurrencyHeadingProps = {
  isActive: boolean
}

type TAlertProps = {
  type: 'danger' | 'info'
}

const Wrapper = styled.div`
  height: 640px;
  display: flex;
`

const Container = styled.div`
  padding: 0 30px 30px 30px;
  padding-top: ${({ pt }: TContainerProps) => `${pt}px`};
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Row = styled.div`
  flex: 1;
`

const ConnectImage = styled.div`
  width: 100%;
  height: 180px;
  background-image: url(${connectImage});
`

const Title = styled.h1`
  margin: 40px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const WalletsTitle = styled.h1`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const WalletsDescription = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
`

const WalletsList = styled.div`
  width: 100%;
  height: 385px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 16px;
  margin: 20px 0 0 0;
  overflow-y: scroll;
`

const Currency = styled.div`
  &:not(:first-child) {
    border-top: 1px solid #eaeaea;
  }
`

const CurrencyHeading = styled.div`
  padding: 10px 10px 10px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ isActive }: TCurrencyHeadingProps) => (isActive ? '#f8f8f8' : '#ffffff')};

  &:hover {
    cursor: ${({ isActive }: TCurrencyHeadingProps) => (isActive ? 'default' : 'pointer')};
    background-color: #f8f8f8;

    path {
      fill: #3fbb7d;
    }
  }
`

const CurrencyHeadingRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 15px;
`

const CurrencyName = styled.p`
  margin: 0;
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const AddAddressButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #dddddd;
  }
`

const Alert = styled.div`
  background-color: ${({ type }: TAlertProps) =>
    type === 'danger' ? 'rgba(235, 87, 87, 0.1)' : '#E9F5EE'};
  padding: 12px 25px 17px 15px;

  p {
    color: ${({ type }: TAlertProps) => (type === 'danger' ? '#EB5757' : '#3FBB7D')};
  }

  path {
    fill: ${({ type }: TAlertProps) => (type === 'danger' ? '#EB5757' : '#3FBB7D')};
  }

  &:hover {
    cursor: pointer;
  }
`

const AlertRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px 0;
`

const AlertIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AlertText = styled.p`
  margin: 0 0 0 15px;
  flex: 1;
  font-size: 14px;
  line-height: 18px;
`

const AlertRefetchText = styled.p`
  margin: 0 0 0 45px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`

const Addresses = styled.div``

const NextAddressRow = styled.div`
  padding: 0 0 15px 60px;
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    margin: 0 0 0 5px;

    path {
      fill: #3fbb7d;
    }
  }

  &:hover {
    cursor: pointer;

    p {
      color: #31a76c;

      path {
        fill: #31a76c;
      }
    }
  }
`

const NextAddressLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #3fbb7d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  ConnectImage,
  Title,
  Description,
  WalletsTitle,
  WalletsDescription,
  Actions,
  WalletsList,
  Currency,
  CurrencyHeading,
  CurrencyHeadingRow,
  CurrencyName,
  AddAddressButton,
  Alert,
  AlertRow,
  AlertIcon,
  AlertText,
  AlertRefetchText,
  Addresses,
  NextAddressRow,
  NextAddressLabel,
}

export default Styles
