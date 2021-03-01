import styled from 'styled-components'

type TContainerProps = {
  isVisible: boolean
}

const Container = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 5px;
  position: absolute;
  opacity: ${({ isVisible }: TContainerProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TContainerProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TContainerProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  width: calc(100% - 60px);
  top: 56px;
`

const ListItem = styled.div`
  padding: 13px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  &:hover {
    background-color: #f8f8f8;
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
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #c3c3c3;
  }
`

const Title = styled.p`
  margin: 0 0 0 13px;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Styles = {
  Container,
  ListItem,
  IconRow,
  Title,
}

export default Styles
