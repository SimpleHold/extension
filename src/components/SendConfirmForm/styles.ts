import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 2px 16px rgba(29, 29, 34, 0.1);
  border-radius: 16px;
`

const Group = styled.div`
  padding: 16px;
`

const Summary = styled.div`
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f7;
  border-radius: 0 0 16px 16px;
`

const SummaryTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: -0.36px;
  color: #1d1d22;
`

const SummaryText = styled.p`
  margin: 4px 0 0 0;
  font-weight: 500;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.41px;
  color: #74758c;
`

const DividerLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #f5f5f7;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:first-child) {
    margin: 16px 0 0 0;
  }
`

const ItemIconRow = styled.div`
  width: 24px;
  height: 24px;
  background-color: #3fbb7d;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin: 0 0 0 16px;
`

const ItemLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #b0b0bd;
`

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const ItemValue = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #1d1d22;
`

const Badge = styled.div`
  padding: 5.5px 8px;
  background-color: #f2f4f8;
  border-radius: 8px;
  margin: 6px 0 0 0;
`

const BadgeValue = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: #74758c;
`

const Styles = {
  Container,
  Group,
  Summary,
  SummaryTitle,
  SummaryText,
  DividerLine,
  Item,
  ItemIconRow,
  ItemRow,
  ItemLabel,
  ItemRight,
  ItemValue,
  Badge,
  BadgeValue,
}

export default Styles
