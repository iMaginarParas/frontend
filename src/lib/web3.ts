import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, sepolia } from '@reown/appkit/networks'

// Whitechain Sepolia Testnet configuration
export const whitechain = {
  id: 1874,
  name: 'Whitechain Sepolia',
  network: 'whitechain-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'WBT',
    symbol: 'WBT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.whitechain.io'] },
    public: { http: ['https://rpc.testnet.whitechain.io'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.whitechain.io' },
  },
  testnet: true,
} as const

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id'

// 2. Set up the Ethers adapter
const ethersAdapter = new EthersAdapter()

// 3. Create the AppKit instance
export const appkit = createAppKit({
  adapters: [ethersAdapter],
  networks: [whitechain, sepolia, mainnet],
  projectId,
  features: {
    analytics: true,
  },
  metadata: {
    name: 'PayLink',
    description: 'Accept USDT payments on Whitechain',
    url: 'https://paylink.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  defaultNetwork: whitechain,
})
