import styled from 'styled-components'

type TContainerProps = {
  disabled?: boolean
}

type TDestinationTypeProps = {
  isPending: boolean
  type: 'spend' | 'received'
}

const Container = styled.div`
  background-color: #ffffff;

  &:hover {
    cursor: ${({ disabled }: TContainerProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ disabled }: TContainerProps) => (disabled ? '#FFFFFF' : '#F8F9FB')};

    .link-icon {
      display: ${({ disabled }: TContainerProps) => (disabled ? 'none' : 'block')};
    }

    .tx-hash {
      color: ${({ disabled }: TContainerProps) => (disabled ? '#1d1d22' : '#3fbb7d')};
    }
  }
`

const Row = styled.div`
  margin: 0 0 0 30px;
  border-bottom: 1px solid rgba(222, 225, 233, 0.5);
  padding: 20px 28px 20px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  height: 80px;
`

const Info = styled.div`
  display: flex;
  align-items: center;
`

const getBackground = ({ isPending, type }: TDestinationTypeProps): string => {
  if (isPending) {
    return '315deg, #E4E6ED 0%, #F0F2F6 100%'
  }
  if (type === 'received') {
    return '135deg, #E3F5EC 0%, #BCE7D1 100%'
  }
  return '135deg, #FEEBD5 0%, #FDDEBA 100%'
}

const getIconColor = ({ isPending, type }: TDestinationTypeProps): string => {
  if (isPending) {
    return '#B1B3BE'
  }

  if (type === 'received') {
    return '#3FBB7D'
  }

  return '#F9A745'
}

const DestinationType = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ isPending, type }: TDestinationTypeProps) =>
    `linear-gradient(${getBackground({ isPending, type })})`};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: ${({ type }: TDestinationTypeProps) =>
      `rotate(${type === 'received' ? 0 : 180}deg)`};

    path {
      fill: ${({ isPending, type }: TDestinationTypeProps) => getIconColor({ isPending, type })};
    }
  }
`

const InfoRow = styled.div`
  margin: 0 0 0 10px;
  overflow: hidden;
  flex: 1;
`

const Hash = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
`

const Date = styled.p`
  margin: 3px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre;
`

const Amounts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const CurrencyAmount = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  text-transform: capitalize;
  color: #1d1d22;
`

const USDAmount = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: #7d7e8d;
`

const TypeRow = styled.div`
  position: relative;
`

const PendingIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  position: absolute;
  top: -3px;
  left: -3px;
  background-color: #3fbb7d;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HashRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const LinkIcon = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 0 0 6px;
  display: none;
`

const Styles = {
  Container,
  Row,
  Info,
  DestinationType,
  InfoRow,
  Hash,
  Date,
  Amounts,
  CurrencyAmount,
  USDAmount,
  TypeRow,
  PendingIcon,
  HashRow,
  LinkIcon,
}

export default Styles
