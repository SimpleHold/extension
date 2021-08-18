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
  width: 15px;
  height: 15px;
  margin: 0 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #bdc4d4;
  }
`

const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: #bdc4d4;
`

const Styles = {
  Container,
  IconRow,
  Title,
}

export default Styles
