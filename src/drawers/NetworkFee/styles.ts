import styled from 'styled-components'

const Body = styled.div`
  height: 440px;
`

const Row = styled.div`
  padding: 24px;
  overflow: scroll;
  height: 385px;
`

const FeeButton = styled.div`
  padding: 12px 16px 12px 12px;
  background-color: #ffffff;
  border: 1px solid #ebebee;
  box-shadow: 0px 2px 16px rgba(29, 29, 34, 0.04);
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:first-child) {
    margin: 16px 0 0 0;
  }

  &:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  &.active {
    border: 1px solid #3fbb7d;

    &:hover {
      cursor: default;
      background-color: #ffffff;
    }
  }
`

const FeeButtonIconRow = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FeeButtonRow = styled.div`
  flex: 1;
  margin: 0 0 0 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const FeeButtonType = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #1d1d22;
  text-transform: capitalize;
`

const FeeButtonValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const FeeButtonValue = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #1d1d22;
  text-transform: uppercase;
`

const FeeButtonEstimated = styled.p`
  margin: 3px 0 0 0;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #b0b0bd;
`

const ButtonRow = styled.div`
  padding: 24px;
`

const Styles = {
  Body,
  Row,
  FeeButton,
  FeeButtonIconRow,
  FeeButtonRow,
  FeeButtonType,
  FeeButtonValues,
  FeeButtonValue,
  FeeButtonEstimated,
  ButtonRow,
}

export default Styles
