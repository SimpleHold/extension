import styled from 'styled-components'

type TBodyProps = {
  isActive: boolean
  bodyHeight: number
}

const Container = styled.div`
  position: relative;
  margin: 24px 0 0 0;
  background-color: #f5f5f7;
  border-radius: 16px;
`

const Heading = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`

const Title = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #1d1d22;
`

const HeadingIconRow = styled.div`
  width: 24px;
  height: 24px;
`

const Body = styled.div`
  display: block;
  position: relative;
  padding: ${({ isActive }: TBodyProps) => (isActive ? '16px 14px' : '0')};
  margin: 0;
  height: ${({ isActive, bodyHeight }: TBodyProps) =>
    isActive && bodyHeight ? `${bodyHeight + 52}px` : 0};
  overflow: hidden;
  transition: height 0.3s;
  border-top: ${({ isActive }: TBodyProps) => (isActive ? '1px solid #EBEBEE' : 'none')};
`

const Text = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #74758c;
`

const Styles = {
  Container,
  Heading,
  Title,
  HeadingIconRow,
  Body,
  Text,
}

export default Styles
