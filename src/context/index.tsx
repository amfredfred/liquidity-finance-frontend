import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

type ContextType = {
  connectWallet: () => void;
  wallet: any;
  disconnectWallet: () => void;
};

export const WalletContext = createContext<ContextType>({
  connectWallet: () => {},
  wallet: null,
  disconnectWallet: () => {},
});

const WalletProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  let ethereum;

  if (typeof window !== "undefined") {
    //@ts-ignore
    ethereum = window?.ethereum;
  }

  const accountChangedHandler = () => checkIfWalletIsConnected();

  const chainChangedHandler = () => window.location.reload();

  const connectWallet = async () => {
    try {
      if (!ethereum)
        return alert(
          "Missing install Metamask. Please access https://metamask.io/ to install extension on your browser"
        );

      //@ts-ignore
      const accounts = await window?.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWallet(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object found");
    }
  };

  const disconnectWallet = () => setWallet(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      //@ts-ignore
      const accounts = await window?.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setWallet(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object found");
    }
  };

  //@ts-ignore
  useEffect(() => checkIfWalletIsConnected(), []);

  ethereum?.on("accountsChanged", accountChangedHandler);

  ethereum?.on("chainChanged", chainChangedHandler);

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
