import styled from 'styled-components'

type TCurrencyHeadingProps = {
  isActive: boolean
}

type TRowProps = {
  pt: number
}

const Wrapper = styled.div`
  height: 640px;
`

const Row = styled.div`
  padding: 30px;
  padding-top: ${({ pt }: TRowProps) => `${pt}px`};
`

const Title = styled.h1`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const CurrenciesList = styled.div`
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 16px;
  width: 100%;
  height: 385px;
  overflow-y: scroll;
  margin: 20px 0 0 0;
`

const Actions = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
`

const CurrencyItem = styled.div`
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
  margin: 0 0 0 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const CurrencyName = styled.p`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  margin: 0;
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

const AddressBlock = styled.div`
  padding: 12px 25px 12px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CheckBoxRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddressBlockRow = styled.div`
  margin: 0 0 0 15px;
  overflow: hidden;
`

const Address = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #1d1d22;
`

const Balance = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

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

const ConnectRow = styled.div`
  height: 520px;
`

const Image = styled.div`
  width: 100%;
  height: 180px;
  background-color: gray;
`

const ConnectTitle = styled.h1`
  margin: 40px 0 0 0;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const ConnectDescription = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const CurrencyBody = styled.div``

const Styles = {
  Wrapper,
  Row,
  Title,
  Description,
  CurrenciesList,
  Actions,
  CurrencyItem,
  CurrencyHeading,
  CurrencyHeadingRow,
  CurrencyName,
  AddAddressButton,
  AddressBlock,
  CheckBoxRow,
  AddressBlockRow,
  Address,
  Balance,
  NextAddressRow,
  NextAddressLabel,
  ConnectRow,
  Image,
  ConnectTitle,
  ConnectDescription,
  CurrencyBody,
}

export default Styles
