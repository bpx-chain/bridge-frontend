import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { chains as cfgChains } from '../configs/Chains';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Your WalletConnect Cloud project ID
const projectId = '132522ee2ce78af15cbed6673dda51bc';

// 2. Create wagmiConfig
const metadata = {
  name: 'BPX Bridge',
  description: 'BPX decentralized cross-chain bridge',
  url: 'https://bridge.bpxchain.cc', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = Object.entries(cfgChains).map(function([k, v]) {
    return v.wagmiChain;
});

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false // Optional - false as default
});

function WalletProvider(props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletProvider;
