import styled from 'styled-components'

import lockIllustrate from '@assets/illustrate/lock.svg'

type TFiltersButtonProps = {
  isActive: boolean
}

type TFiltersRowProps = {
  isActive: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

const Extension = styled.div`
  width: 375px;
  height: 700px;
  background-color: white;
  border: 1px solid #eaeaea;
  filter: drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.15));
  border-radius: 16px;
  overflow: hidden;
`

const Header = styled.header`
  padding: 15px 30px;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;

  path {
    fill: #ffffff;
  }
`

const CloseButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
    background-color: rgb(255 255 255 / 80%);

    path {
      fill: #3fbb7d;
    }
  }
`

const Body = styled.div`
  background-color: #ffffff;
  height: 640px;
`

const Row = styled.div`
  padding: 30px 30px 40px 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const SiteBlock = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const UseOn = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const SiteInfo = styled.div`
  margin: 0 0 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 8px;
`

const SiteUrl = styled.p`
  margin: 0 0 0 5px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Addresses = styled.div`
  background-color: #f8f8f8;
  border-top: 1px solid #eaeaea;
  height: 515px;
  overflow-y: scroll;
  border-radius: 0 0 16px 16px;
  padding: 15px 30px 20px 30px;
`

const AddressesRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AddressesLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const FiltersButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ isActive }: TFiltersButtonProps) => (isActive ? '#3fbb7d' : '#C3C3C3')};
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const AddressesList = styled.div`
  margin: 10px 0 0 0;
  position: relative;
`

const FiltersRow = styled.div`
  margin: 10px 0 0 0;
  opacity: ${({ isActive }: TFiltersRowProps) => (isActive ? '1' : '0')};
  height: ${({ isActive }: TFiltersRowProps) => (isActive ? '60px' : '0')};
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`

const LockedRow = styled.div`
  padding: 50px 30px 0 30px;
`

const LockImage = styled.div`
  width: 315px;
  height: 180px;
  background-image: url(${lockIllustrate});
  background-repeat: no-repeat;
  background-size: contain;
`

const LockedTitle = styled.p`
  margin: 30px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const LockedForm = styled.form`
  margin: 20px 0 0 0;
`

const LockedFormActions = styled.div`
  margin: 5px 0 0 0;
`

const Styles = {
  Wrapper,
  Extension,
  Header,
  Logo,
  CloseButton,
  Body,
  Row,
  Title,
  SiteBlock,
  UseOn,
  SiteInfo,
  SiteFavicon,
  SiteUrl,
  Addresses,
  AddressesRow,
  AddressesLabel,
  FiltersButton,
  AddressesList,
  FiltersRow,
  LockedRow,
  LockImage,
  LockedTitle,
  LockedForm,
  LockedFormActions,
}

export default Styles
