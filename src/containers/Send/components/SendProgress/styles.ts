import styled from 'styled-components'

type TContainerProps = {
  pb: number
}

const Container = styled.div`
  padding: ${({ pb }: TContainerProps) => `0 0 ${pb}px 0`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StepRow = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: #3fbb7d;
  }
`

const Line = styled.div`
  width: 24px;
  height: 1px;
  background-color: #ebebee;
  margin: 0 8px;

  &.active {
    background-color: #3fbb7d;
  }
`

const StepRowDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #ebebee;
  border-radius: 5px;

  &.active {
    background-color: #3fbb7d;
  }
`

const Styles = {
  Container,
  Item,
  StepRow,
  Line,
  StepRowDot,
}

export default Styles
