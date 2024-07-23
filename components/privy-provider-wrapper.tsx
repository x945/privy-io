'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import {defineChain} from 'viem';

export const polygonChain = defineChain({
  id: 80002, // Replace this with your chain's ID
  name: 'Polygon Amoy',
  network: 'Polygon Amoy',
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: ['https://polygon-amoy.g.alchemy.com/v2/9aHCL7I90Xo_YSRD3P1PxkyMEANMyWl7'],
      webSocket: ['wss://polygon-amoy.g.alchemy.com/v2/9aHCL7I90Xo_YSRD3P1PxkyMEANMyWl7'],
    },
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'https://amoy.polygonscan.com'},
  },
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config= {{
        defaultChain: polygonChain,
        supportedChains: [polygonChain],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
