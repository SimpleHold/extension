import styled from 'styled-components'

type TProps = {
  type: 'light' | 'gray'
}

const Container = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ type }: TProps) =>
    type === 'light' ? 'rgba(255, 255, 255, 0.1)' : '#F8F8F8'};
  border: ${({ type }: TProps) =>
    `1px solid ${type === 'light' ? 'rgba(255, 255, 255, 0.5)' : '#F8F8F8'}`};
  backdrop-filter: blur(30px);
  border-radius: 5px;
`

const Title = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: ${({ type }: TProps) => (type === 'light' ? '#FFFFFF' : '#C3C3C3')};
  opacity: ${({ type }: TProps) => (type === 'light' ? '0.8' : '1')};
`

const Values = styled.div``

const BTCValue = styled.p`
  margin: 0 0 4px 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: ${({ type }: TProps) => (type === 'light' ? '#FFFFFF' : '#7D7E8D')};
`

const USDValue = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: ${({ type }: TProps) => (type === 'light' ? '#FFFFFF' : '#7D7E8D')};
`

const Styles = {
  Container,
  Title,
  Values,
  BTCValue,
  USDValue,
}

export default Styles
