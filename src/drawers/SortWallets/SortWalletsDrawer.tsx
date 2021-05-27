import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
}

type ListItem = {
  title: string
  key: string
  types: {
    asc: string
    desc: string
  }
}

const SortWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const list: ListItem[] = [
    {
      title: 'Balances',
      key: 'balances',
      types: {
        asc: 'Ascending',
        desc: 'Descending',
      },
    },
    {
      title: 'Creation date',
      key: 'date',
      types: {
        asc: 'Newer first',
        desc: 'Older first',
      },
    },
    {
      title: 'Alphabet',
      key: 'alphabet',
      types: {
        asc: 'A-Z',
        desc: 'Z-A',
      },
    },
  ]

  const onApply = (): void => {}

  return (
    <DrawerWrapper title="Sort by" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.List>
          {list.map((item: ListItem) => {
            const { title, key, types } = item

            return (
              <Styles.ListItem key={key}>
                <Styles.ListItemRow>
                  <Styles.ListArrows>
                    <Styles.ListArrow />
                    <Styles.ListArrow />
                  </Styles.ListArrows>
                  <Styles.ListTitle>{title}</Styles.ListTitle>
                </Styles.ListItemRow>
                <Styles.ListSortType>{types.asc}</Styles.ListSortType>
              </Styles.ListItem>
            )
          })}
        </Styles.List>

        <Styles.Actions>
          <Button label="Apply" disabled isSmall onClick={onApply} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default SortWalletsDrawer
