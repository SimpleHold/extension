export type TTab = {
  title: string
  key: string
  badge?: number
  renderItem: React.ReactElement<any, any> | null
}

export interface Props {
  tabs: TTab[]
  activeTabKey: string
  onSelectTab: (tabKey: string) => () => void
}
