import styled from 'styled-components'

const Container = styled.form`
  border-top: 1px solid #f2f4f8;
`

const Body = styled.div`
  padding: 20px;
`

const NetworkFeeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid #f2f4f8;
`

const NetworkFeeRow = styled.div`
  flex: 1;
`

const NetworkFeeLabel = styled.p`
  margin: 0 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
  color: #3fbb7d;
`

const NetworkFee = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #1d1d22;
`

const InputButton = styled.div`
  padding: 6px 10px;
  background-color: #e9f5ee;
  border-radius: 5px;
  transition: all 0.3s;
  position: absolute;
  right: 9px;
  bottom: 9px;

  &:hover {
    cursor: pointer;
    background-color: #3fbb7d;

    p {
      color: #ffffff;
    }
  }
`

const InputButtonLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #3fbb7d;
`

const RemoveButton = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #f2f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 10px;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
  Body,
  NetworkFeeBlock,
  NetworkFeeRow,
  NetworkFeeLabel,
  NetworkFee,
  InputButton,
  InputButtonLabel,
  RemoveButton,
}

export default Styles
