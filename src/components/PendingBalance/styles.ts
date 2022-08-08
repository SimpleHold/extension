import styled from 'styled-components'

type TContainerProps = {
  type: 'light' | 'gray'
}

const Container = styled.div`
  background-color: ${({ type }: TContainerProps) =>
    type === 'light' ? 'rgba(255, 255, 255, 0.2)' : '#F8F8F8'};
  border-radius: 15px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  p {
    color: ${({ type }: TContainerProps) => (type === 'light' ? '#ffffff' : '#7D7E8D')};
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
  padding: 8px 15px 8px 0;
`

const Pending = styled.p`
  margin: 0 10px 0 0;
  line-height: 14px;
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #FFFFFF;
  text-transform: capitalize;
`

const USDValue = styled.p`
  line-height: 14px;
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-size: 12px;
  color: #FFFFFF;
`

const Styles = {
  Container,
  IconRow,
  Row,
  Pending,
  USDValue,
}

export default Styles
