import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
  overflow: hidden;
`

const Container = styled.div`
  padding: 30px 30px 0 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const WalletActions = styled.div`
  margin: 32px 0 0 0;
`

const Action = styled.div`
  background-color: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 38px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:not(:last-child) {
    margin: 0 0 20px 0;
  }

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;

    span {
      display: block;
    }
  }
`

const ActionIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ActionName = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;
`

const HoverActionText = styled.span`
  margin: 5px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
  display: none;
  position: absolute;
  bottom: 20px;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  Description,
  WalletActions,
  Action,
  ActionIcon,
  ActionName,
  HoverActionText,
}

export default Styles
