import styled from 'styled-components'

type TRenameBlockProps = {
  isDisabled: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 20px 0;
  position: relative;
`

const WalletName = styled.p`
  margin: 0 11px 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const MoreButton = styled.div`
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 15px;
  background: rgba(222, 225, 233, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;
    background: rgba(222, 225, 233, 0.4);

    path {
      fill: #3fbb7d;
    }
  }
`

const RenameBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  margin: 0 20px 0 0;

  svg {
    min-width: 9px;
    min-height: 11px;
  }

  &:hover {
    cursor: ${({ isDisabled }: TRenameBlockProps) => (isDisabled ? 'default' : 'pointer')};

    path {
      fill: ${({ isDisabled }: TRenameBlockProps) => (isDisabled ? '#1d1d22' : '#3fbb7d')};
    }

    p {
      color: ${({ isDisabled }: TRenameBlockProps) => (isDisabled ? '#1d1d22' : '#3fbb7d')};
    }
  }
`

const HardwareIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px 0 0;

  path {
    fill: #1d1d22;
  }
`

const Styles = {
  Container,
  WalletName,
  MoreButton,
  RenameBlock,
  HardwareIcon,
}

export default Styles
