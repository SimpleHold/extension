import styled from 'styled-components'

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 24px 30px 0 30px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px 30px 30px;
`

const Title = styled.p`
  margin: 0;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
  font-weight: bold;
`

const SubTitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #7d7e8d;
`

const Destinations = styled.div`
  position: relative;
  margin: 40px 0 0 0;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 42px 30px 30px 30px;
`

const CurrencyLogo = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Destination = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin: 10px 0 0 0;
  }
`

const DestinationType = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const DestinationText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Order = styled.div`
  margin: 10px 0 0 0;
  border-radius: 16px;
  background-color: #ffffff;
`

const Amounts = styled.div`
  padding: 25px 30px 20px 30px;
`

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border: none;
`

const Tbody = styled.tbody``

const TableTr = styled.tr`
  &:not(:first-child) {
    td {
      p {
        margin-top: 10px;
      }
    }
  }
`

const TableTd = styled.td`
  &:not(:first-child) {
    width: 1%;
    white-space: nowrap;
  }
`

const TableTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const TableAmount = styled.p`
  margin: 0 10px 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const TableSymbol = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Divider = styled.div`
  width: 100%;
  height: 16px;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
`

const DividerCircle = styled.div`
  width: 16px;
  height: 16px;
  background-color: #f2f4f8;
  border-radius: 8px;
  position: absolute;

  &:first-child {
    left: -8px;
  }

  &:last-child {
    right: -8px;
  }
`

const DividerLine = styled.div`
  width: 100%;
  height: 0;
  border: 1px dashed #f2f4f8;
`

const Total = styled.div`
  padding: 16px 30px 24px 30px;
`

const TableTotal = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const SiteInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 0 0;
`

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin: 0 5px 0 0;
`

const SiteUrl = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  Actions,
  Title,
  SubTitle,
  Destinations,
  CurrencyLogo,
  Destination,
  DestinationType,
  DestinationText,
  Order,
  Amounts,
  Table,
  Tbody,
  TableTr,
  TableTd,
  TableTitle,
  TableAmount,
  TableSymbol,
  Divider,
  DividerCircle,
  DividerLine,
  Total,
  TableTotal,
  SiteInfoRow,
  SiteFavicon,
  SiteUrl,
}

export default Styles
