import styled from 'styled-components'

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

const Styles = {
  AddressBlock,
  CheckBoxRow,
  AddressBlockRow,
  Address,
  Balance,
}

export default Styles
