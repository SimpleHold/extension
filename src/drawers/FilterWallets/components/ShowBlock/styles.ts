import styled from 'styled-components'

type TCountBlockProps = {
  isActive: boolean
}

const Container = styled.div`
  padding: 10px 10px 10px 16px;
  background-color: #f8f9fb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin: 6px 0 0 0;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const CountBlock = styled.div`
  margin: 0 0 0 10px;
  padding: 3px 8px;
  background-color: ${({ isActive }: TCountBlockProps) =>
    isActive ? 'rgba(215, 239, 227, 0.7)' : 'rgba(222, 225, 233, 0.7)'};
  border-radius: 10px;

  p {
    color: ${({ isActive }: TCountBlockProps) => (isActive ? '#3fbb7d' : '#7D7E8D')};
  }
`

const Count = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`

const SwitchRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Styles = {
  Container,
  Row,
  Title,
  CountBlock,
  Count,
  SwitchRow,
}

export default Styles
