import styled from 'styled-components'

type TContainerProps = {
  isVisible: boolean
}

const Container = styled.div`
  border: 1px solid #dee1e9;
  position: absolute;
  opacity: ${({ isVisible }: TContainerProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TContainerProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TContainerProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  width: 100%;
  top: 50px;
  z-index: 2;
  box-shadow: 0px 5px 30px rgba(125, 126, 141, 0.15);
  border-radius: 16px;
  background-color: #ffffff;
`

const ListItem = styled.div`
  padding: 13px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;

  &:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  &:last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  &:hover {
    background: rgba(242, 244, 248, 0.5);
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
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #bdc4d4;
  }
`

const Title = styled.p`
  margin: 0 0 0 10px;
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
