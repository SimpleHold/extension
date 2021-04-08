import styled from 'styled-components'

type TActionsProps = {
  mt: number
}

type TActionProps = {
  size: 'small' | 'big'
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  height: 540px;
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  padding: 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Actions = styled.div`
  margin-top: ${({ mt }: TActionsProps) => `${mt}px`};
`

const Action = styled.div`
  background: #fafafa;
  border: 1px solid #dfdfdf;
  box-sizing: border-box;
  border-radius: 5px;
  padding: ${({ size }: TActionProps) => (size === 'big' ? '38px 0' : '29px 0')};
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: ${({ size }: TActionProps) => (size === 'big' ? '20px' : '15px')};
  }

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
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

const Styles = {
  Wrapper,
  Container,
  Title,
  Description,
  Actions,
  Action,
  ActionIcon,
  ActionName,
}

export default Styles
