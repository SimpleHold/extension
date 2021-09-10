import styled from 'styled-components'

type TContainerProps = {
  width: number
}

type TArrowsProps = {
  type: 'asc' | 'desc' | null
}

const Container = styled.div`
  padding: 12px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f2f4f8;
  border-radius: 8px;
  width: ${({ width }: TContainerProps) => `${width}px`};

  &:nth-child(2) {
    margin: 0 8px;
  }

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }

    svg {
      path {
        fill: #3fbb7d;
      }
    }
  }
`

const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
  flex: 1;
  user-select: none;
`

const Arrows = styled.div`
  width: 8px;
  height: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  svg {
    &:first-child {
      path {
        fill: ${({ type }: TArrowsProps) => (type === 'asc' ? '#3fbb7d' : '#BDC4D4')};
      }
    }

    &:last-child {
      transform: rotate(180deg);

      path {
        fill: ${({ type }: TArrowsProps) => (type === 'desc' ? '#3fbb7d' : '#BDC4D4')};
      }
    }
  }
`

const Styles = {
  Container,
  Title,
  Arrows,
}

export default Styles
