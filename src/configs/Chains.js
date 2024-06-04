import { arbitrum, polygon, avalanche } from 'wagmi/chains';

export const chains = {
    '279': {
        name: 'BPX Chain',
        icon: 'https://docs.bpxchain.cc/uploads/images/gallery/2024-05/scaled-1680-/w6EHDmZn0TOCyfXL-bpx-icon.png',
        wagmiChain: {
            id: 279,
            name: 'BPX Chain',
            nativeCurrency: { name: 'BPX', symbol: 'BPX', decimals: 18 },
            rpcUrls: {
                default: { http: ['https://rpc.mainnet.bpxchain.cc'] }
            },
            blockExplorers: {
                default: { name: 'BPX Block Explorer', url: 'https://explorer.mainnet.bpxchain.cc' }
            }
        },
        contract: '0x53fa3006A40AA0Cb697736819485cE6D30DEAEb5',
        currency: 'BPX',
        retryBlocks: 15000
    },
    '42161': {
        name: 'Arbitrum',
        icon: 'https://docs.bpxchain.cc/uploads/images/gallery/2024-05/scaled-1680-/GSmi0tsqdO4c8aQs-arbitrum-arb-logo.png',
        wagmiChain: arbitrum,
        contract: '0x5CD1A383d9C881577dDF6E5E092Db25b2D50e9B3',
        currency: 'ETH',
        retryBlocks: 2500000
    },
    '137': {
        name: 'Polygon',
        icon: 'https://docs.bpxchain.cc/uploads/images/gallery/2024-05/scaled-1680-/IC1RfzSsW8RNnW03-polygon-matic-logo.png',
        wagmiChain: polygon,
        contract: '0x5CD1A383d9C881577dDF6E5E092Db25b2D50e9B3',
        currency: 'MATIC',
        retryBlocks: 250000
    },
    '43114': {
        name: 'Avalanche C-Chain',
        icon: 'https://docs.bpxchain.cc/uploads/images/gallery/2024-05/scaled-1680-/w39GXaR1qZl27yvd-avalanche-avax-logo.png',
        wagmiChain: avalanche,
        contract: '0x5CD1A383d9C881577dDF6E5E092Db25b2D50e9B3',
        currency: 'AVAX',
        retryBlocks: 1250000
    }
};