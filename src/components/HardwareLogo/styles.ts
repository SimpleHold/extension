import styled from 'styled-components'

type TContainerProps = {
  color: string
  size: number
  mr?: number
}

const Container = styled.div`
  width: ${({ size }: TContainerProps) => `${size}px`};
  height: ${({ size }: TContainerProps) => `${size}px`};
  margin-right: ${({ mr }: TContainerProps) => (mr ? `${mr}px` : '0')};

  path {
    fill: ${({ color }: TContainerProps) => color};
  }
`

const Styles = {
  Container,
}

export default Styles
