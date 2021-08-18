import styled from 'styled-components'

type TDescriptionProps = {
  isFileBroken: boolean
  isFileUploaded: boolean
}

const getDescriptionColor = (props: TDescriptionProps) => {
  const { isFileBroken, isFileUploaded } = props

  if (isFileBroken) {
    return '#EB5757'
  }

  if (isFileUploaded) {
    return '#3FBB7D'
  }

  return '#7D7E8D'
}

const Container = styled.div`
  background-color: #f8f9fb;
  border: 1px dashed #bdc4d4;
  border-radius: 16px;
  padding: 0 32px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    border: 1px dashed #3fbb7d;

    svg,
    p {
      opacity: 0.5;
    }
  }
`

const IconRow = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${(props: TDescriptionProps) => getDescriptionColor(props)};
`

const Styles = {
  Container,
  IconRow,
  Description,
}

export default Styles
