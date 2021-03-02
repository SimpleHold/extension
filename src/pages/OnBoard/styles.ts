import styled from 'styled-components'

type TProgressDotProps = {
  isCurrent: boolean
}

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const Container = styled.div`
  padding: 40px 30px 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 540px;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Illustrate = styled.img`
  width: 315px;
  height: 180px;
`

const Title = styled.p`
  margin: 40px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-transform: capitalize;
  color: #1d1d22;
  text-align: center;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Footer = styled.div`
  padding: 0 0 30px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Progress = styled.div`
  width: 52px;
  height: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const NextBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const NextLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;
`

const ArrowIconRow = styled.div`
  margin: 0 0 0 10px;

  svg {
    transform: rotate(180deg);

    path {
      fill: #3fbb7d;
    }
  }
`

const ProgressDot = styled.div`
  width: ${({ isCurrent }: TProgressDotProps) => (isCurrent ? '20px' : '6px')};
  height: 6px;
  background-color: ${({ isCurrent }: TProgressDotProps) => (isCurrent ? '#3FBB7D' : '#D3ECDD')};
  border-radius: 5px;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Illustrate,
  Title,
  Description,
  Footer,
  Progress,
  NextBlock,
  NextLabel,
  ArrowIconRow,
  ProgressDot,
}

export default Styles
