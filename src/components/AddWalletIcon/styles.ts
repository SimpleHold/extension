import styled from 'styled-components'

type TProps = {
  small?: boolean
}

const Circle = styled.div`
  height: ${({ small }: TProps) => `${small ? 20 : 36}px`};
  width: ${({ small }: TProps) => `${small ? 20 : 36}px`};
  border-radius: 20px;
  background-color: #fff;
  bottom: 20px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    line {
      stroke: #3fbb7d;
    }
  }
`

const Styles = {
  Circle,
}

export default Styles
