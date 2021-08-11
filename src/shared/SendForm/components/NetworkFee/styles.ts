import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 0 0;
  padding: 5px 20px 5px 5px;
  background-color: #ffffff;
  border-radius: 16px;
`

const IncludeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  user-select: none;
`

const IncludeLabel = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #7d7e8d;
`

const SwitchRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Styles = {
  Container,
  IncludeBlock,
  IncludeLabel,
  SwitchRow,
}

export default Styles
