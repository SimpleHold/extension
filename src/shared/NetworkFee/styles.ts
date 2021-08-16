import styled from 'styled-components'

const Container = styled.div`
  margin: 10px 0 0 0;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 20px 5px 5px;
  background-color: #ffffff;
  border-radius: 16px;
`

const IncludeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  user-select: none;
`

const IncludeLabel = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #7d7e8d;
  white-space: nowrap;
`

const SwitchRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AboutFee = styled.div`
  margin: 10px 0 0 0;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  user-select: none;

  path {
    fill: #bdc4d4;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }

    p {
      color: #3fbb7d;
    }
  }
`

const AboutFeeLabel = styled.p`
  margin: 0 0 0 5px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Container,
  Row,
  IncludeBlock,
  IncludeLabel,
  SwitchRow,
  AboutFee,
  AboutFeeLabel,
}

export default Styles
