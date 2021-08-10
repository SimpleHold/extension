import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid #ffffff;
  border-radius: 12px;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }
`

const Row = styled.div`
  width: 153px;
  height: 48px;
`

const Heading = styled.div``

const Label = styled.p``

const Styles = {
  Container,
  Row,
  Heading,
  Label,
}

export default Styles

// type TVisibleProps = {
//   isVisible: boolean
// }

// const Container = styled.div`
//   position: relative;
//   filter: drop-shadow(0px 5px 30px rgba(125, 126, 141, 0.15));
//   user-select: none;
// `

// const Row = styled.div`
//   width: 100px;
//   height: 34px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 0 9px 0 14px;
//   justify-content: space-between;
//   background-color: #f8f9fb;
//   border: ${({ isVisible }: TVisibleProps) => `1px solid ${isVisible ? '#3fbb7d' : '#dee1e9'}`};
//   border-radius: ${({ isVisible }: TVisibleProps) => (isVisible ? '8px 8px 0 0' : '8px')};

//   p {
//     color: ${({ isVisible }: TVisibleProps) => (isVisible ? '#3fbb7d' : '#7d7e8d')};
//   }

//   svg {
//     transition: all 0.3s;
//     transform: ${({ isVisible }: TVisibleProps) => `rotate(${isVisible ? 180 : 0}deg)`};

//     path {
//       fill: ${({ isVisible }: TVisibleProps) => (isVisible ? '#3fbb7d' : '#bdc4d4')};
//     }
//   }

//   &:hover {
//     cursor: pointer;
//     border: 1px solid #3fbb7d;

//     p {
//       color: #3fbb7d;
//     }

//     path {
//       fill: #3fbb7d;
//     }
//   }
// `

// const Title = styled.p`
//   margin: 0;
//   font-size: 14px;
//   line-height: 16px;
//   text-transform: capitalize;
// `

// const List = styled.div`
//   position: absolute;
//   width: 100px;
//   opacity: ${({ isVisible }: TVisibleProps) => (isVisible ? '1' : '0')};
//   visibility: ${({ isVisible }: TVisibleProps) => (isVisible ? 'visible' : 'hidden')};
//   transform: ${({ isVisible }: TVisibleProps) => `translateY(${isVisible ? '0' : '-20px'})`};
//   transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
// `

// const ListItem = styled.div`
//   background-color: #ffffff;
//   padding: 10px 14px;
//   border-left: 1px solid #3fbb7d;
//   border-right: 1px solid #3fbb7d;

//   &:last-child {
//     border-radius: 0 0 8px 8px;
//     border-bottom: 1px solid #3fbb7d;
//   }

//   &:hover {
//     cursor: pointer;
//     background-color: #f8f9fb;
//   }
// `

// const ListItemLabel = styled.p`
//   margin: 0;
//   font-size: 14px;
//   line-height: 16px;
//   color: #7d7e8d;
//   text-transform: capitalize;
// `

// const Styles = {
//   Container,
//   Row,
//   Title,
//   List,
//   ListItem,
//   ListItemLabel,
// }

// export default Styles
