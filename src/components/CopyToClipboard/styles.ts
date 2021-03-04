import styled, { keyframes } from 'styled-components'

import tooltipArrowIcon from '@assets/icons/tooltipArrow.svg'

const scale = keyframes`
  0% {
    transform: scale(.5) translateY(-100%);
    opacity: 0;
  }
  
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
`

type TContainerProps = {
  mb?: number
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ mb }: TContainerProps) => (mb ? `${mb}px` : '0')};

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }

    & > div:not(:first-child) {
      transform: scale(1);
      animation: ${scale} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
  }
`

const Row = styled.div``

const Tooltip = styled.div`
  position: absolute;
  padding: 12px 18px;
  background-color: #ffffff;
  border-radius: 5px;
  bottom: -100%;
  box-shadow: 0px 2px 10px rgb(125 126 141 / 20%);
  transform: scale(0);

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 100%;
    width: 18px;
    height: 9px;
    background-image: url(${tooltipArrowIcon});
    left: calc(100% / 2 - 9px);
  }
`

const TooltipText = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  Tooltip,
  TooltipText,
}

export default Styles
