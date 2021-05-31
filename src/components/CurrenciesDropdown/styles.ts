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

type TListItemProps = {
  disabled: boolean
  pv?: number
}

type TListItemRowProps = {
  withLogo: boolean
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
  border-top: none;
  background-color: #ffffff;
  width: 100%;
  border-radius: 0 0 5px 5px;
  position: absolute;
  opacity: ${({ isVisible }: TVisibleProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TVisibleProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TVisibleProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  top: 62px;
  max-height: 255px;
  overflow-y: scroll;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ pv }: TListItemProps) => (pv ? `${pv}px 10px` : '10px')};
  overflow: hidden;
  border: 1px solid #3fbb7d;
  position: relative;
  background-color: #ffffff;

  &:not(:last-child) {
    border-bottom: none;
  }

  &:first-child {
    &:after {
      content: '';
      width: calc(100% + 20px);
      margin: 0 0 0 -20px;
      position: absolute;
      height: 1px;
      background-color: #eaeaea;
      bottom: 0;
    }
  }

  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  &:hover {
    cursor: ${({ disabled }: TListItemProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ disabled }: TListItemProps) => (disabled ? '#ffffff' : '#f8f8f8')};

    p:last-child {
      color: ${({ disabled }: TListItemProps) => (disabled ? '#1d1d22' : '#3fbb7d')};
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
  margin: ${({ withLogo }: TListItemRowProps) => (withLogo ? '0 0 0 10px' : '0')};
  overflow: hidden;
  flex: 1;
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
