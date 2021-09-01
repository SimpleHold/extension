import styled, { keyframes } from 'styled-components'

import tooltipArrowIcon from '@assets/icons/tooltipArrow.svg'

type TContainerProps = {
  mt?: number
  left?: number
  zIndex: number
}

type TTooltipProps = {
  direction?: 'left' | 'right'
  maxWidth?: number
  textSpace?: string
  arrowLeft?: number
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
  z-index: ${({ zIndex }: TContainerProps) => zIndex};

  &:hover {
    cursor: pointer;

    .tooltip {
      transform: scale(1);
      top: ${({ mt }: TContainerProps) =>
        `calc(100% + 9px + ${typeof mt !== 'undefined' ? mt : 0}px)`};
      animation: ${scale} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      left: ${({ left }: TContainerProps) => (left ? `${left}px` : 'initial')};
    }
  }
`

const Tooltip = styled.div`
  position: absolute;
  padding: 10px 20px;
  background-color: #ffffff;
  border-radius: 5px;
  transform: scale(0);
  right: ${({ direction }: TTooltipProps) => (direction === 'right' ? '-13px' : 'initial')};
  width: ${({ maxWidth }: TTooltipProps) => (maxWidth ? `${maxWidth}px` : 'auto')};

  span {
    white-space: ${({ textSpace }: TTooltipProps) => textSpace || 'nowrap'};
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 18px;
    height: 9px;
    background-image: url(${tooltipArrowIcon});
    left: ${({ direction, arrowLeft }: TTooltipProps) =>
      arrowLeft ? `${arrowLeft}px` : direction === 'right' ? 'initial' : 'calc(100% / 2 - 9px)'};
    right: ${({ direction }: TTooltipProps) => (direction === 'right' ? '20px' : 'initial')};
    bottom: 100%;
  }
`

const TooltipText = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
  user-select: none;
`

const Styles = {
  Container,
  Tooltip,
  TooltipText,
}

export default Styles
