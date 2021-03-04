import styled from 'styled-components'

type TContainerProps = {
  mt?: number
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${({ mt }: TContainerProps) => `${mt ? `${mt}px` : '0'}`};

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }

    path {
      fill: #3fbb7d;
    }
  }
`

const IconRow = styled.div`
  width: 17px;
  height: 17px;
  margin: 0 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Styles = {
  Container,
  IconRow,
  Title,
}

export default Styles
