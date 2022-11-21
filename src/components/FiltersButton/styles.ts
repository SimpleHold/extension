import styled from 'styled-components'

type TProps = {
  invertColors?: boolean
  withBadge?: boolean
}

const Container = styled.div`
  border-radius: 22px;
  background: ${({ invertColors }: TProps) =>
    invertColors ? 'rgba(255, 255, 255, 0.2)' : '#F5F5F7'};
  transition: all 0.3s;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:not(:last-child) {
    margin: 0 8px 0 0;
  }

  path {
    fill: #000;
  }

  &:hover {
    cursor: pointer;
    background: #31a76c;

    path {
      fill: #fff;
    }
  }
`

const FiltersActiveDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #eb5757;
  position: absolute;
  top: 6px;
  right: 8px;
  border-radius: 3px;
`

const Styles = {
  Container,
  FiltersActiveDot,
}

export default Styles
