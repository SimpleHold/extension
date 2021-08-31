import styled from 'styled-components'

type THeadingProps = {
  isVisible: boolean
}

type TBodyProps = {
  isVisible: boolean
}

const Container = styled.div`
  position: relative;
`

const Heading = styled.div`
  background: #ffffff;
  border: ${({ isVisible }: THeadingProps) => `1px solid ${isVisible ? '#3fbb7d' : '#dee1e9'}`};
  border-radius: ${({ isVisible }: THeadingProps) => (isVisible ? '8px 8px 0 0' : '8px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 10px 14px 20px;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }

  .arrow {
    svg {
      transition: all 0.3s;
      transform: ${({ isVisible }: THeadingProps) => `rotate(${isVisible ? 90 : 270}deg)`};
    }
  }
`

const HeadingTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const ArrowIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #3fbb7d;
  }
`

const Body = styled.div`
  position: absolute;
  top: 60px;
  border: 1px solid #3fbb7d;
  border-top: none;
  filter: drop-shadow(0px 5px 30px rgba(125, 126, 141, 0.15));
  border-radius: 0 0 8px 8px;
  width: 100%;
  background-color: #ffffff;
  overflow: scroll;
  z-index: 2;
  opacity: ${({ isVisible }: TBodyProps) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }: TBodyProps) => (isVisible ? 'visible' : 'hidden')};
  transform: ${({ isVisible }: TBodyProps) => `translateY(${isVisible ? '0' : '-20px'})`};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`

const Styles = {
  Container,
  Heading,
  HeadingTitle,
  ArrowIcon,
  Body,
}

export default Styles
