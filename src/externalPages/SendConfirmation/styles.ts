import styled from 'styled-components'

const Body = styled.div`
  height: 640px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  padding: 40px 30px 0 30px;
  flex: 1;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: #1d1d22;
`

const SiteInfo = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const SiteInfoLabel = styled.p`
  margin: 0 10px 5px 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const SiteInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 5px 0;
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

const OrderCheck = styled.div`
  margin: 50px 0 0 0;
`

const DashedDivider = styled.div`
  padding: 5px 0 15px 0;
`

const DashedDividerLine = styled.div`
  width: 100%;
  border-top: 1px dashed #c3c3c3;
`

const DestinationsList = styled.ul`
  list-style-type: none;
  padding: 30px 0 0 20px;
  overflow: hidden;
`

const Destinate = styled.li`
  position: relative;
  margin-bottom: 0;
  padding-bottom: 20px;

  &:before {
    content: '';
    position: absolute;
    left: -17px;
    border-left: 1px solid #c3c3c3;
    height: 100%;
    width: 1px;
  }

  &:after {
    content: '';
    width: 7px;
    height: 7px;
    background-color: #c3c3c3;
    border-radius: 4px;
    position: absolute;
    left: -20px;
    top: 5px;
  }

  &:first-child:before {
    top: 6px;
  }

  &:last-child:before {
    height: 6px;
  }
`

const DestinateTitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #7d7e8d;
`

const DestinateText = styled.p`
  margin: 5px 0 0 0;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px 30px 30px;
`

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border: none;
`

const Tbody = styled.tbody``

const TableTr = styled.tr``

const TableTd = styled.td`
  &:not(:first-child) {
    width: 1%;
    white-space: nowrap;
  }
`

const TableTitle = styled.p`
  margin: 0 0 10px 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const TableAmount = styled.p`
  margin: 0 0 10px 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const TableSymbol = styled.p`
  margin: 0 0 10px 4px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Styles = {
  Body,
  Row,
  Title,
  SiteInfo,
  SiteInfoLabel,
  SiteInfoRow,
  SiteFavicon,
  SiteUrl,
  OrderCheck,
  DashedDivider,
  DashedDividerLine,
  DestinationsList,
  Destinate,
  DestinateTitle,
  DestinateText,
  Actions,
  Table,
  Tbody,
  TableTr,
  TableTd,
  TableTitle,
  TableAmount,
  TableSymbol,
}

export default Styles
