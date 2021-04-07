import styled from 'styled-components'

type TVisibleProps = {
  isVisible: boolean
}

const Wrapper = styled.div`
  margin: 0 0 10px 0;
  position: relative;
  filter: ${({ isVisible }: TVisibleProps) =>
    isVisible ? 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.3))' : 'none'};
`

const Container = styled.div`
  padding: 10px;
  background-color: #ffffff;
  border: ${({ isVisible }: TVisibleProps) => `1px solid ${isVisible ? '#3fbb7d' : '#eaeaea'}`};
  border-radius: ${({ isVisible }: TVisibleProps) => (isVisible ? '5px 5px 0px 0px' : '5px')};
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }
`

const Row = styled.div`
  margin: 0 0 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const Info = styled.div`
  flex: 1;
`

const Label = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const CurrencyName = styled.p`
  margin: 2px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
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

const NetworksList = styled.div`
  border: 1px solid #eaeaea;
  border-top: none;
  background-color: #ffffff;
  width: 100%;
  border-radius: 0 0 5px 5px;
  position: absolute;
  opacity: ${({ isVisible }: TVisibleProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TVisibleProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TVisibleProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  width: 100%;
  top: 62px;
`

const ListItem = styled.div``

const ListItemLabel = styled.p``

const Styles = {
  Wrapper,
  Container,
  Row,
  Info,
  Label,
  CurrencyName,
  ArrowIconRow,
  NetworksList,
  ListItem,
  ListItemLabel,
}

export default Styles
