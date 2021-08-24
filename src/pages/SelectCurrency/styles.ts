import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const CurrenciesList = styled.div`
  margin: 20px 0 0 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  max-height: 355px;
  overflow-y: scroll;
`

const CurrencyBlock = styled.div`
  border: 1px solid #dee1e9;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #f8f9fb;
    border: 1px solid #3fbb7d;

    p > {
      color: #3fbb7d;
    }
  }
`

const CurrencyName = styled.p`
  margin: 10px 0 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: capitalize;
  color: #1d1d22;
`

const CurrencySymbol = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: uppercase;
  color: #7d7e8d;
`

const CustomTokenLogo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 100%),
    #c3c3c3;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    path {
      fill: #ffffff;
    }
  }
`

const CustomTokenLabel = styled.p`
  margin: 10px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: capitalize;
  color: #3fbb7d;
`

const NotFoundMessage = styled.p`
  margin: 10px 0 0 0px;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Tab = styled.div`
  padding: 30px;
`

const HardwareWallets = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HardwareWallet = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fb;
  border: 1px solid #dee1e9;
  border-radius: 16px;
  flex: 1;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;

    path {
      fill: #3fbb7d;
    }
  }

  &:first-child {
    margin: 0 7.5px 0 0;
  }

  &:last-child {
    margin: 0 0 0 7.5px;
  }
`

const CustomTokenBlock = styled(CurrencyBlock)`
  border: 1px solid #ffffff;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #ffffff;

    > div {
      background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(255, 255, 255, 0.1) 100%
        ),
        #3fbb7d;
    }
  }
`

const Styles = {
  Wrapper,
  Container,
  Tab,
  HardwareWallets,
  HardwareWallet,
  NotFoundMessage,
  CurrenciesList,
  CurrencyBlock,
  CurrencyName,
  CurrencySymbol,
  CustomTokenLogo,
  CustomTokenLabel,
  CustomTokenBlock,
}

export default Styles
