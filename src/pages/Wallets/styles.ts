import styled from 'styled-components'

type TProps = {
  isUnfolded?: boolean
}

const Wrapper = styled.div`
  height: 600px;
  transition: 0.5s ease;
  background-color: #3FBB7D;
`

const WalletsListContainer = styled.div`
  position: relative;
  transition: 0.5s ease;

  .ReactVirtualized__List {
    transition: 0.4s ease-in;
    padding-top: ${({ isUnfolded }: TProps) => isUnfolded ? '0 !important;' : '56px !important;'};
  }
`

const AddWalletButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3fbb7d;
  filter: drop-shadow(0px 2px 10px rgba(125, 126, 141, 0.3));
  position: absolute;
  bottom: 20px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #31a76c;
  }
`

const Styles = {
  Wrapper,
  WalletsListContainer,
  AddWalletButton,
}

export default Styles
