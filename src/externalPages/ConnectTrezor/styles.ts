import styled from 'styled-components'

type TCurrencyHeadingProps = {
  withCurrencies: boolean
}

const Wrapper = styled.div`
  height: 640px;
`

const Row = styled.div`
  padding: 30px;
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

const AddressesList = styled.div`
  width: 100%;
  height: 385px;
  border: 1px solid #eaeaea;
  border-radius: 14px;
  margin: 20px 0 0 0;
  overflow-y: scroll;
`

const Actions = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Currency = styled.div`
  &:not(:first-child) {
    border-top: 1px solid #eaeaea;
  }
`

const CurrencyHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ withCurrencies }: TCurrencyHeadingProps) =>
    withCurrencies ? '15px 15px 10px 15px' : '15px'};
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
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const CurrencyButton = styled.div`
  padding: 8px 14px;
  background-color: #f8f8f8;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }
`

const CurrencyButtonTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #3fbb7d;
`

const CurrencyAddresses = styled.div`
  padding: 0 15px 15px 15px;
`

const CurrencyAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CurrencyAddressRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 15px;
  flex: 1;
`

const AddressInfo = styled.div`
  flex: 1;
  margin: 0 20px 0 0;
`

const Address = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #1d1d22;
`

const AddressBalance = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const RadioButtonRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorRow = styled.div`
  padding: 40px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  height: 570px;
`

const ErrorContentRow = styled.div`
  flex: 1;
`

const Image = styled.div`
  width: 100%;
  height: 180px;
  background-color: gray;
`

const ErrorTitle = styled.h1`
  margin: 40px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const ErrorDescription = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Row,
  Title,
  Description,
  AddressesList,
  Actions,
  Currency,
  CurrencyHeading,
  CurrencyHeadingRow,
  CurrencyName,
  CurrencyButton,
  CurrencyButtonTitle,
  CurrencyAddresses,
  CurrencyAddress,
  CurrencyAddressRow,
  AddressInfo,
  Address,
  AddressBalance,
  RadioButtonRow,
  ErrorRow,
  Image,
  ErrorContentRow,
  ErrorTitle,
  ErrorDescription,
}

export default Styles
