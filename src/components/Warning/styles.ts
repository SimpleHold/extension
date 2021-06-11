import styled from 'styled-components'

type TContainerProps = {
  color?: string
  br?: number
  mt?: number
  padding?: string
  background?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${({ mt }: TContainerProps) => (mt ? `${mt}px` : '20px')};
  border-radius: ${({ br }: TContainerProps) => (br ? `${br}px` : '0')};
  background: ${({ background }: TContainerProps) => background || 'none'};
  padding: ${({ padding }: TContainerProps) => padding || '0'};

  path {
    fill: ${({ color }: TContainerProps) => color || '#C3C3C3'};
  }

  p {
    color: ${({ color }: TContainerProps) => color || '#C3C3C3'};
  }
`

const IconRow = styled.div`
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.p`
  margin: 0 0 0 6px;
  flex: 1;
  font-size: 14px;
  line-height: 19px;
`

const Styles = {
  Container,
  IconRow,
  Text,
}

export default Styles
