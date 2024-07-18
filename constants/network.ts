import { Network } from "./networkInterface";

const NETWORKS = {
  luksoMain: {
      EOA_PRIVATE_KEY: "0xbfc8c7ad11e33ffe01c61c82249453ee49d1719faafce27f9b9d52771c58a25d",
      EOA_PUBLIC_KEY: "0xEa61c097B26CEcDe571eFe01A2A219656dC0459c",
      UP_ADDR_CONTROLLED_BY_EOA: "0x7DdEE8C820536c75cD0b47a92de22Df75C131838",
  },
  luksoTestnet: {
    EOA_PRIVATE_KEY: "0xbfc8c7ad11e33ffe01c61c82249453ee49d1719faafce27f9b9d52771c58a25d",
    EOA_PUBLIC_KEY: "0xEa61c097B26CEcDe571eFe01A2A219656dC0459c",
    UP_ADDR_CONTROLLED_BY_EOA: "0x7DdEE8C820536c75cD0b47a92de22Df75C131838",
  },
} as {
  [key: string]: Network;
};

export const getNetworkAccountsConfig = (name: string) => {
  switch (name) {
    case 'luksoMain':
      return NETWORKS.luksoMain;
    case 'luksoTestnet':
      return NETWORKS.luksoTestnet;
    default:
      throw new Error(`Unknown network ${name}`);
  }
};