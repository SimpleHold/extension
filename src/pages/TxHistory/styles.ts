import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
`

const Heading = styled.div`
  padding: 20px 30px 10px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Button = styled.div`
  width: 40px;
  height: 30px;
  background-color: #f2f4f8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Group = styled.div``

const GroupDateRow = styled.div`
  margin: 0 0 0 30px;
`

const GroupDate = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Wrapper,
  Container,
  Heading,
  Title,
  Button,
  Group,
  GroupDateRow,
  GroupDate,
}

export default Styles