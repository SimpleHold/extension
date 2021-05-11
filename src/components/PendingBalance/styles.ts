import styled from 'styled-components'

type TContainerProps = {
  type: 'light' | 'gray'
}

const Container = styled.div`
  background-color: ${({ type }: TContainerProps) =>
    type === 'light' ? 'rgba(255, 255, 255, 0.2)' : '#F8F8F8'};
  border-radius: 5px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  p {
    color: ${({ type }: TContainerProps) => (type === 'light' ? '#ffffff' : '#7D7E8D')};
  }

  div:last-child {
    border-left: ${({ type }: TContainerProps) =>
      `1px solid ${type === 'light' ? '#38b175' : '#EAEAEA'}`};
  }

  svg {
    path {
      fill: ${({ type }: TContainerProps) => (type === 'light' ? '#ffffff' : '#C3C3C3')};
    }
  }
`

const IconRow = styled.div`
  padding: 7px 10px;
  height: 30px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
`

const Pending = styled.p`
  margin: 0 10px 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`

const USDValue = styled.p`
  margin: 0;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
`

const Styles = {
  Container,
  IconRow,
  Row,
  Pending,
  USDValue,
}

export default Styles
