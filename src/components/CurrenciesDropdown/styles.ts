import styled from 'styled-components'

type TVisibleProps = {
  isVisible: boolean
}

type TContainerProps = {
  disabled?: boolean
  isVisible: boolean
  isNotSelected: boolean
}

type TRowProps = {
  isNotSelected: boolean
}

type TLabelProps = {
  isNotSelected: boolean
}

const Wrapper = styled.div`
  margin: 0 0 10px 0;
  position: relative;
  filter: ${({ isVisible }: TVisibleProps) =>
    isVisible ? 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.3))' : 'none'};
  z-index: 2;
`

const Container = styled.div`
  padding: ${({ isNotSelected }: TContainerProps) =>
    isNotSelected ? '15px 10px 15px 20px' : '10px'};
  background-color: #ffffff;
  border: ${({ isVisible }: TContainerProps) => `1px solid ${isVisible ? '#3fbb7d' : '#eaeaea'}`};
  border-radius: ${({ isVisible }: TContainerProps) => (isVisible ? '5px 5px 0px 0px' : '5px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 30px);

  &:hover {
    cursor: ${({ disabled }: TContainerProps) => (disabled ? 'default' : 'pointer')};
    border: ${({ disabled }: TContainerProps) => `1px solid ${disabled ? '#eaeaea' : '#3fbb7d'}`};
  }
`

const Row = styled.div`
  margin: ${({ isNotSelected }: TRowProps) => (isNotSelected ? '0' : '0 0 0 10px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  overflow: hidden;
`

const Info = styled.div`
  flex: 1;
  overflow: hidden;
`

const Label = styled.p`
  margin: 0;
  font-size: ${({ isNotSelected }: TLabelProps) => (isNotSelected ? '16px' : '12px')};
  line-height: ${({ isNotSelected }: TLabelProps) => (isNotSelected ? '19px' : '16px')};
  color: #7d7e8d;
`

const Value = styled.p`
  margin: 2px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border: 1px solid #3fbb7d;
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

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  overflow: hidden;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  &:hover {
    cursor: pointer;
    background-color: #f8f8f8;

    p:last-child {
      color: #3fbb7d;
    }
  }
`

const ListItemValue = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ListItemRow = styled.div`
  margin: 0 0 0 10px;
  overflow: hidden;
`

const ListItemLabel = styled.p`
  margin: 0 0 2px 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Info,
  Label,
  Value,
  ArrowIconRow,
  NetworksList,
  ListItem,
  ListItemRow,
  ListItemValue,
  ListItemLabel,
}

export default Styles
