'use client'

declare let window: any;
import { createContext, useContext, useState } from "react";
import { ethers, BrowserProvider } from 'ethers';
import goMarketABI from '../abi/goMarket.json';
import { usePrivy, useWallets } from "@privy-io/react-auth";

interface DataContextProps {
  account: string;
  loading: boolean;
  loadAuth: () => Promise<void>;
  loadBlockchainData: () => Promise<void>;
  goMarket: any;
  walletSigner: any;
  feeData: any;
  provider: any;
};

const DataContext = createContext<DataContextProps>({
  account: "",
  loading: true,
  loadAuth: async () => {},
  loadBlockchainData: async () => {},
  goMarket: null,
  walletSigner: null,
  feeData: null,
  provider: null,
});

interface Props {
    children?: React.ReactNode;
};

export const DataProvider: React.FC<Props> = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [goMarket, setgoMarket] = useState<any>();
  const [walletSigner, setWalletSigner] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [feeData, setFeeData] = useState<any>();
  const {ready, authenticated, user} = usePrivy();
  const {wallets} = useWallets();

  const loadAuth = async () => {
    if (ready && authenticated && user) {
      const userWallet = user.wallet ? user.wallet.address : "";
      setAccount(userWallet);
    }
  };

  const loadBlockchainData = async () => {
    const wallet = wallets[0];
    if (wallet) {
      await wallet.switchChain(80002);
      const eip1193 = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(eip1193);
      setProvider(provider);

      const feeData = await provider.getFeeData();
      setFeeData(feeData);

      const signer = await provider.getSigner();
      setWalletSigner(signer);
      
      const marketContract = new ethers.Contract('0x0Bc1FcA0bC7b0B06fDa8DB3A1Cb0504A06404923', goMarketABI, signer);
      setgoMarket(marketContract);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    account,
    goMarket,
    loading,
    loadAuth,
    loadBlockchainData,
    walletSigner,
    feeData,
    provider,
  };
};
