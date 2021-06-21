import styled from 'styled-components'

type TVisibleProps = {
  isVisible: boolean
}

type TContainerProps = {
  disabled?: boolean
  isVisible: boolean
  isNotSelected: boolean
  padding?: string
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

type TDropdownRowProps = {
  isVisible: boolean
}

type TListProps = {
  maxHeight: number
}

type TDropdownButtonProps = {
  color: string
}

const Wrapper = styled.div`
  margin: 0 0 10px 0;
  position: relative;
  filter: ${({ isVisible }: TVisibleProps) =>
    isVisible ? 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.3))' : 'none'};
  z-index: 2;
`

const Container = styled.div`
  padding: ${({ isNotSelected, padding }: TContainerProps) =>
    isNotSelected ? padding || '15px 10px 15px 20px' : '10px'};
  background-color: #ffffff;
  border: ${({ isVisible }: TContainerProps) => `1px solid ${isVisible ? '#3fbb7d' : '#eaeaea'}`};
  border-radius: ${({ isVisible }: TContainerProps) => (isVisible ? '5px 5px 0px 0px' : '5px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  max-height: 60px;

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

const DropdownRow = styled.div`
  position: absolute;
  width: 100%;
  opacity: ${({ isVisible }: TDropdownRowProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TDropdownRowProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TDropdownRowProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  background-color: #ffffff;
  border-radius: 0 0 5px 5px;
  border: 1px solid #3fbb7d;
  border-top: none;
`

const List = styled.div`
  max-height: ${({ maxHeight }: TListProps) => `${maxHeight}px`};
  overflow-y: scroll;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ pv }: TListItemProps) => (pv ? `${pv}px 10px` : '10px')};
  overflow: hidden;
  position: relative;
  background-color: #ffffff;
  max-height: 60px;

  &:not(:last-child) {
    border-bottom: none;
    border-bottom: 1px solid #eaeaea;
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

const ListItemValue = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DropdownActions = styled.div`
  padding: 10.5px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #eaeaea;
`

const DropdownButton = styled.div`
  height: 36px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eaeaea;
  border-radius: 5px;

  p {
    color: ${({ color }: TDropdownButtonProps) => color};
  }

  &:first-child {
    margin: 0 7.5px 0 0;
  }

  &:last-child {
    margin: 0 0 0 7.5px;
  }

  &:hover {
    cursor: pointer;
    border: ${({ color }: TDropdownButtonProps) => `1px solid ${color}`};
  }
`

const DropdownButtonLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Info,
  Label,
  Value,
  ArrowIconRow,
  DropdownRow,
  List,
  ListItem,
  ListItemRow,
  ListItemLabel,
  ListItemValue,
  DropdownActions,
  DropdownButton,
  DropdownButtonLabel,
}

export default Styles
