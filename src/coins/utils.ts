// Utils
import { fetchBalances } from '@utils/api'

// Config
import { NOT_ETH_NETWORKS, TNetwork } from '@config/networks'

export const getCurrencyBalance = async (address: string, tokenChain?: string): Promise<number> => {
  try {
    if (tokenChain) {
      const mapNotEthNetworks = NOT_ETH_NETWORKS.map((network: TNetwork) => network.chain)

      if (mapNotEthNetworks.indexOf(tokenChain) !== -1) {
        const request = await fetchBalances([
          {
            address,
            chain: tokenChain,
            isFullBalance: true,
          },
        ])

        if (request) {
          return request[0].balanceInfo.balance
        }
      }
    }

    return 0
  } catch {
    return 0
  }
}
