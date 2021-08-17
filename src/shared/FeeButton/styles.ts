import styled from 'styled-components'

type TListProps = {
  isVisible: boolean
}

type TRowProps = {
  disabled: boolean
  isVisible: boolean
  openFrom?: string
}

type TFeeProps = {
  isError: boolean
}

type TListItemProps = {
  openFrom?: string
}

const Container = styled.div`
  position: relative;
  user-select: none;
`

const Row = styled.div`
  padding: 7px 14px;
  width: ${({ openFrom }: TRowProps) => (openFrom === 'browser' ? '153px' : '173px')};
  border-radius: ${({ isVisible }: TRowProps) => (isVisible ? '12px 12px 0 0' : '12px')};
  border: ${({ isVisible }: TRowProps) => `1px solid ${isVisible ? '#3fbb7d' : '#ffffff'}`};

  .arrow {
    transition: all 0.3s;
    transform: ${({ isVisible }: TRowProps) => `rotate(${isVisible ? 180 : 0}deg)`};

    path {
      fill: ${({ isVisible }: TRowProps) => (isVisible ? '#3FBB7D' : '#7D7E8D')};
    }
  }

  p {
    color: ${({ isVisible }: TRowProps) => (isVisible ? '#3fbb7d' : '#7d7e8d')};
  }

  &:hover {
    cursor: ${({ disabled }: TRowProps) => (disabled ? 'default' : 'pointer')};
    border: ${({ disabled }: TRowProps) => `1px solid ${disabled ? '#ffffff' : '#3fbb7d'}`};

    .label {
      color: ${({ disabled }: TRowProps) => (disabled ? '#7d7e8d' : '#3fbb7d')};
    }

    .arrow {
      path {
        fill: #3fbb7d;
      }
    }
  }
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 4px 0;
`

const Label = styled.p`
  margin: 0 4px 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
`

const Body = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Fee = styled.span`
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: ${({ isError }: TFeeProps) => (isError ? '#EB5757' : '#1D1D22')};
`

const IconRow = styled.div`
  margin: 0 0 0 4px;

  path {
    fill: #eb5757;
  }
`

const List = styled.div`
  position: absolute;
  width: 173px;
  opacity: ${({ isVisible }: TListProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TListProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TListProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`

const ListItem = styled.div`
  background-color: #ffffff;
  padding: 7px 14px;
  border-left: 1px solid #3fbb7d;
  border-right: 1px solid #3fbb7d;
  height: ${({ openFrom }: TListItemProps) => (openFrom === 'browser' ? '35px' : '50px')};

  &:not(:last-child) {
    border-bottom: 1px solid rgba(222, 225, 233, 0.5);
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
    border-bottom: 1px solid #3fbb7d;
  }

  &:hover {
    cursor: pointer;
    background-color: #f8f9fb;

    .fee-type {
      color: #3fbb7d;
    }
  }
`

const ListItemLabel = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
  color: #7d7e8d;
`

const ListItemValue = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #1d1d22;
`

const Styles = {
  Container,
  Row,
  Heading,
  Label,
  Body,
  Fee,
  IconRow,
  List,
  ListItem,
  ListItemLabel,
  ListItemValue,
}

export default Styles
