import styled, { keyframes } from 'styled-components'

import tooltipArrowIcon from '@assets/icons/tooltipArrow.svg'

type TContainerProps = {
  mt?: number
}

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

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0px 3px 15px rgba(125, 126, 141, 0.2));

  &:hover {
    cursor: pointer;

    .tooltip {
      transform: scale(1);
      top: ${({ mt }: TContainerProps) =>
        `calc(100% + 9px + ${typeof mt !== 'undefined' ? mt : 0}px)`};
      animation: ${scale} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
  }
`

const Tooltip = styled.div`
  position: absolute;
  padding: 10px 20px;
  background-color: #ffffff;
  border-radius: 5px;
  transform: scale(0);

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 18px;
    height: 9px;
    background-image: url(${tooltipArrowIcon});
    left: calc(100% / 2 - 9px);
    bottom: 100%;
  }
`

const TooltipText = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
  white-space: nowrap;
`

const Styles = {
  Container,
  Tooltip,
  TooltipText,
}

export default Styles
