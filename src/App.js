import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

import Navbar from './components/Navbar';
import Tabs from './components/Tabs';

// 1. Your WalletConnect Cloud project ID
const projectId = '132522ee2ce78af15cbed6673dda51bc'

// 2. Set chains
const mainnet = {
  chainId: 279,
  name: 'BPX Chain',
  currency: 'BPX',
  explorerUrl: 'https://explorer.mainnet.bpxchain.cc',
  rpcUrl: 'https://rpc.mainnet.bpxchain.cc'
}

// 3. Create a metadata object
const metadata = {
  name: 'BPX Bridge',
  description: 'BPX decentralized cross-chain bridge',
  url: 'https://bridge.bpxchain.cc', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: false, // true by default
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: false // Optional - defaults to your Cloud configuration
})

function App() {
  return (
    <>
      <Navbar />
      <Tabs />
    </>
  );
}

export default App;
