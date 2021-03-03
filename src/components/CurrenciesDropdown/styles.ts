import styled from 'styled-components'

type TSelectedAddressBlockProps = {
  isDisabled: boolean
}

const Container = styled.div`
  margin: 0 0 10px 0;
`

const SelectedAddressBlock = styled.div`
  padding: 9px 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  border-radius: 5px;

  &:hover {
    cursor: ${({ isDisabled }: TSelectedAddressBlockProps) => (isDisabled ? 'default' : 'pointer')};
    border: ${({ isDisabled }: TSelectedAddressBlockProps) =>
      ` 1px solid ${isDisabled ? '#eaeaea' : '#3fbb7d'}`};
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin: 0 0 0 10px;
  overflow: hidden;
`

const Address = styled.p`
  flex: 1;
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  color: #1d1d22;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`

const ArrowIconRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 19px;

  svg {
    transform: rotate(270deg);

    path {
      fill: #3fbb7d;
    }
  }
`

const AddressesList = styled.div`
  background-color: #ffffff;
  max-height: 250px;
  overflow-y: scroll;
  border: 1px solid #eaeaea;
  border-radius: 0 0 5px 5px;
  position: absolute;
  width: calc(100% - 60px);
`

const AddressItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;

  &:hover {
    cursor: pointer;
    background-color: #f8f8f8;
  }
`

const Styles = {
  Container,
  SelectedAddressBlock,
  Row,
  Address,
  ArrowIconRow,
  AddressesList,
  AddressItem,
}

export default Styles
