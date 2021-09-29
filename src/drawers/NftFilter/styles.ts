import styled from 'styled-components'

type TNetworkProps = {
  withIcon: boolean
  isActive: boolean
}

const Container = styled.div`
  margin: 20px 0 0 0;
  flex: 1;
  height: 467px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Group = styled.div`
  margin: 0 0 30px 0;
`

const GroupTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Actions = styled.div`
  padding: 30px 0;
`

const GroupHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const GroupBody = styled.div`
  margin: 10px 0 0 0;
`

const NetworksList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Network = styled.div`
  height: 40px;
  background-color: ${({ isActive }: TNetworkProps) => (isActive ? '#E9F7F0' : '#f2f4f8')};
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  padding-left: ${({ withIcon }: TNetworkProps) => (withIcon ? '15px' : '20px')};

  path {
    fill: ${({ isActive }: TNetworkProps) => (isActive ? '#3FBB7D' : '#BDC4D4')};
  }

  p {
    color: ${({ isActive }: TNetworkProps) => (isActive ? '#3FBB7D' : '#7D7E8D')};
  }

  &:not(:first-child) {
    margin: 0 0 0 10px;
  }

  &:hover {
    cursor: ${({ isActive }: TNetworkProps) => (isActive ? 'default' : 'pointer')};

    p {
      color: #3fbb7d;
    }

    path {
      fill: #3fbb7d;
    }
  }
`

const NetworkTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
`

const ResetGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ResetTitle = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const ResetIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: #f2f4f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const CurrenciesList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: -10px;
`

const Styles = {
  Container,
  Row,
  Group,
  GroupTitle,
  Actions,
  GroupHeading,
  GroupBody,
  NetworksList,
  Network,
  NetworkTitle,
  ResetGroup,
  ResetTitle,
  ResetIcon,
  CurrenciesList,
}

export default Styles
