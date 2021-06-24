import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Utils
import { toLower } from '@utils/format'
import { getItem, setItem, removeItem } from '@utils/storage'

// Hooks
import useState from '@hooks/useState'

// Assets
import sortArrow from '@assets/icons/sortArrow.svg'

// Styles
import Styles from './styles'

const list: ListItem[] = [
  {
    title: 'Balance',
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
      asc: 'Older first',
      desc: 'Newer first',
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

interface Props {
  onClose: () => void
  onApply: () => void
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

interface IState {
  activeSortKey: string | null
  activeSortType: 'asc' | 'desc' | null
}

const SortWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, onApply, isActive } = props

  const {
    state: { activeSortKey, activeSortType },
    updateState,
  } = useState<IState>({
    activeSortKey: null,
    activeSortType: null,
  })

  React.useEffect(() => {
    checkActiveSortType()
  }, [])

  const checkActiveSortType = (): void => {
    const getSortKey = getItem('activeSortKey')
    const getSortType = getItem('activeSortType')

    if (getSortKey || getSortType) {
      const findListItem = getSortKey
        ? list.find((item: ListItem) => toLower(item.key) === toLower(getSortKey))
        : undefined

      if ((findListItem && getSortType === 'asc') || getSortType === 'desc') {
        updateState({
          activeSortKey: getSortKey,
          activeSortType: getSortType,
        })
      } else {
        removeItem('activeSortKey')
        removeItem('activeSortType')
      }
    }
  }

  const onApplySort = (): void => {
    if (activeSortKey) {
      setItem('activeSortKey', activeSortKey)
    } else {
      removeItem('activeSortKey')
    }

    if (activeSortType) {
      setItem('activeSortType', activeSortType)
    } else {
      removeItem('activeSortType')
    }
    onApply()
  }

  const onClickItem = (key: string): void => {
    const findListItem = list.find((item: ListItem) => toLower(item.key) === toLower(key))

    if (findListItem) {
      if (activeSortKey === key) {
        updateState({
          activeSortType: activeSortType === 'asc' ? 'desc' : null,
        })

        if (activeSortType === 'desc') {
          updateState({
            activeSortKey: null,
          })
        }
      } else {
        updateState({
          activeSortKey: key,
          activeSortType: 'asc',
        })
      }
    }
  }

  const isButtonDisabled =
    (!activeSortKey &&
      !activeSortType &&
      !getItem('activeSortKey') &&
      !getItem('activeSortType')) ||
    (getItem('activeSortKey') === activeSortKey && getItem('activeSortType') === activeSortType)

  return (
    <DrawerWrapper title="Sort by" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.List>
          {list.map((item: ListItem) => {
            const { title, key, types } = item

            const isActive = activeSortKey === key
            const getSortName = activeSortType
              ? activeSortType === 'asc'
                ? types.asc
                : types.desc
              : null

            return (
              <Styles.ListItem key={key} isActive={isActive} onClick={() => onClickItem(key)}>
                <Styles.ListItemRow>
                  <Styles.ListArrows>
                    <Styles.ListArrowsRow>
                      <Styles.ListArrow
                        position="up"
                        isActive={isActive && activeSortType === 'asc'}
                      >
                        <SVG src={sortArrow} width={8} height={6} />
                      </Styles.ListArrow>
                      <Styles.ListArrow
                        position="down"
                        isActive={isActive && activeSortType === 'desc'}
                      >
                        <SVG src={sortArrow} width={8} height={6} />
                      </Styles.ListArrow>
                    </Styles.ListArrowsRow>
                  </Styles.ListArrows>
                  <Styles.ListTitle>{title}</Styles.ListTitle>
                </Styles.ListItemRow>
                {isActive && getSortName ? (
                  <Styles.ListSortType>{getSortName}</Styles.ListSortType>
                ) : null}
              </Styles.ListItem>
            )
          })}
        </Styles.List>

        <Styles.Actions>
          <Button label="Apply" disabled={isButtonDisabled} isSmall onClick={onApplySort} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default SortWalletsDrawer
