// import * as React from 'react'
// import { useHistory, useLocation } from 'react-router-dom'
// import SVG from 'react-inlinesvg'
// import { List, ListRowProps, WindowScroller, ScrollParams } from 'react-virtualized'
//
// // Components
// import WalletCard from '@components/WalletCard'
// import CollapsibleHeader from '@components/CollapsibleHeader'
//
// // Drawers
// import FilterWalletsDrawer from '@drawers/FilterWallets'
//
// // Hooks
// import useToastContext from '@hooks/useToastContext'
// import useState from '@hooks/useState'
//
// // Utils
// import { IWallet, getWallets, sortWallets, filterWallets, getWalletName } from '@utils/wallet'
// import { logEvent } from '@utils/amplitude'
// import { setBadgeText, getBadgeText } from '@utils/extension'
// import { clear } from '@utils/storage'
//
// // Config
// import { ADD_ADDRESS, FILTERS_WATCH, HISTORY_WATCH } from '@config/events'
//
// // Types
// import { ILocationState, IState } from './types'
//
// // Styles
// import Styles from './styles'
//
// const initialState: IState = {
//   wallets: null,
//   totalBalance: null,
//   totalEstimated: null,
//   pendingBalance: null,
//   activeDrawer: null,
//   scrollPosition: 0,
// }
//
// const WalletsContainer: React.FC = () => {
//   const history = useHistory()
//   const { state: locationState } = useLocation<ILocationState>()
//   const { state, updateState } = useState<IState>(initialState)
//
//   const [walletsBalance, setWalletsBalance] = React.useState<number[]>([])
//   const [walletsEstimated, setWalletsEstimated] = React.useState<number[]>([])
//   const [walletsPending, setWalletsPending] = React.useState<number[]>([])
//
//   const addToast = useToastContext()
//   const walletsTop = Math.max(110, 290 - 1.25 * state.scrollPosition)
//
//   React.useEffect(() => {
//     getWalletsList()
//     checkBadgeText()
//   }, [])
//
//   React.useEffect(() => {
//     if (
//       state.wallets?.length === 0 &&
//       state.totalBalance === null &&
//       state.totalEstimated === null
//     ) {
//       updateState({
//         totalBalance: 0,
//         totalEstimated: 0,
//       })
//     }
//   }, [state.wallets, state.totalBalance, state.totalEstimated])
//
//   React.useEffect(() => {
//     if (locationState?.status === 'passcodeTurnedOff') {
//       addToast('Your passcode is disabled now. You can turn it on in settings.')
//     }
//   }, [locationState])
//
//   React.useEffect(() => {
//     if (walletsBalance.length === state.wallets?.length && state.totalBalance === null) {
//       updateState({ totalBalance: walletsBalance.reduce((a, b) => a + b, 0) })
//     }
//   }, [walletsBalance, state.totalBalance])
//
//   React.useEffect(() => {
//     if (walletsEstimated.length === state.wallets?.length && state.totalEstimated === null) {
//       updateState({ totalEstimated: walletsEstimated.reduce((a, b) => a + b, 0) })
//     }
//   }, [walletsEstimated, state.totalEstimated])
//
//   React.useEffect(() => {
//     if (walletsPending.length === state.wallets?.length && state.pendingBalance === null) {
//       updateState({ pendingBalance: walletsPending.reduce((a, b) => a + b, 0) })
//     }
//   }, [walletsPending, state.pendingBalance])
//
//   const checkBadgeText = async () => {
//     const text = await getBadgeText()
//
//     if (text?.length) {
//       setBadgeText('')
//     }
//   }
//
//   const getWalletsList = () => {
//     updateState({ wallets: null })
//
//     const walletsList = getWallets()
//
//     if (walletsList) {
//       updateState({ wallets: walletsList.filter(filterWallets).sort(sortWallets) })
//     } else {
//       clear()
//       history.push('/welcome')
//     }
//   }
//
//   const onAddNewAddress = (): void => {
//     logEvent({
//       name: ADD_ADDRESS,
//     })
//
//     history.push('/select-currency')
//   }
//
//   const sumBalance = (amount: number) => {
//     setWalletsBalance((prevArray: number[]) => [...prevArray, amount])
//   }
//
//   const sumEstimated = (amount: number) => {
//     setWalletsEstimated((prevArray: number[]) => [...prevArray, amount])
//   }
//
//   const sumPending = (amount: number) => {
//     setWalletsPending((prevArray: number[]) => [...prevArray, amount])
//   }
//
//   const onCloseDrawer = (): void => {
//     updateState({ activeDrawer: null })
//   }
//
//   const onApplyDrawer = (): void => {
//     onCloseDrawer()
//     getWalletsList()
//   }
//
//   const getNameWallet = (wallet: IWallet): string => {
//     if (wallet.walletName) {
//       return wallet.walletName
//     }
//
//     const walletsList = getWallets()
//
//     if (walletsList) {
//       const { symbol, uuid, hardware, chain, name } = wallet
//
//       return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
//     }
//
//     return ''
//   }
//
//   const onViewTxHistory = (): void => {
//     history.push('/tx-history')
//
//     logEvent({
//       name: HISTORY_WATCH,
//     })
//   }
//
//   const openFilters = (): void => {
//     updateState({ activeDrawer: 'filters' })
//
//     logEvent({
//       name: FILTERS_WATCH,
//     })
//   }
//
//   const onViewNFT = (): void => {
//     history.push('/nft-collection')
//   }
//
//   const renderWallet = ({ index, style, key }: ListRowProps): React.ReactNode => {
//     const wallet = state.wallets?.[index]
//
//     if (wallet) {
//       const {
//         address,
//         symbol,
//         chain,
//         name,
//         contractAddress,
//         decimals,
//         isHidden,
//         uuid,
//         hardware,
//         isNotActivated,
//       } = wallet
//
//       const walletName = getNameWallet(wallet)
//
//       return (
//         <div
//           style={{
//             ...style,
//             ...Styles.ListItem,
//           }}
//           key={key}
//         >
//           <WalletCard
//             address={address}
//             chain={chain}
//             symbol={symbol.toLowerCase()}
//             name={name}
//             contractAddress={contractAddress}
//             decimals={decimals}
//             isHidden={isHidden}
//             sumBalance={sumBalance}
//             sumEstimated={sumEstimated}
//             sumPending={sumPending}
//             walletName={walletName}
//             uuid={uuid}
//             hardware={hardware}
//             isNotActivated={isNotActivated}
//           />
//         </div>
//       )
//     }
//
//     return null
//   }
//
//   const onScroll = ({ scrollTop }: ScrollParams): void => {
//     updateState({ scrollPosition: scrollTop })
//   }
//
//   return (
//     <>
//       <Styles.Wrapper>
//         <CollapsibleHeader
//           scrollPosition={state.scrollPosition}
//           balance={state.totalBalance}
//           estimated={state.totalEstimated}
//           pendingBalance={state.pendingBalance}
//           isDrawersActive={state.activeDrawer !== null}
//           onViewTxHistory={onViewTxHistory}
//           openFilters={openFilters}
//           onViewNFT={onViewNFT}
//         />
//         <Styles.WalletsList style={{ top: walletsTop }}>
//           <WindowScroller>
//             {({ registerChild }) => (
//               <div ref={registerChild}>
//                 <List
//                   onScroll={onScroll}
//                   height={600}
//                   style={Styles.List}
//                   rowCount={state.wallets?.length || 0}
//                   rowHeight={86}
//                   rowRenderer={renderWallet}
//                   width={375}
//                   overscanRowCount={50}
//                   noRowsRenderer={() => (
//                     <Styles.NotFound>
//                       Nothing was found for the specified parameters
//                     </Styles.NotFound>
//                   )}
//                 />
//               </div>
//             )}
//           </WindowScroller>
//           <Styles.AddWalletButton onClick={onAddNewAddress}>
//             <SVG src="../../assets/icons/plus.svg" width={14} height={14} title="Add new wallet" />
//           </Styles.AddWalletButton>
//         </Styles.WalletsList>
//       </Styles.Wrapper>
//       <FilterWalletsDrawer
//         isActive={state.activeDrawer === 'filters'}
//         onClose={onCloseDrawer}
//         onApply={onApplyDrawer}
//       />
//     </>
//   )
// }
//
// export default WalletsContainer

export default null