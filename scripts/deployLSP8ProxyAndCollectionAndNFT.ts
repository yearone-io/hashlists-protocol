import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import LSP8Proxy from "../artifacts/contracts/LSP8Proxy.sol/LSP8Proxy.json";
import config from '../hardhat.config';
import { getNetworkAccountsConfig } from '../constants/network';

//1. Deployes Proxy
//2. Deployes LSP8 Collection
//3. Mints LSP8 NFT

// load env vars
dotenv.config();

// Update those values in the .env file
const { NETWORK } = process.env;
const { EOA_PRIVATE_KEY } = getNetworkAccountsConfig(NETWORK as string);

async function deployLSP8Proxy() {
    // setup provider
    const provider = new ethers.JsonRpcProvider(config.networks[NETWORK].url);
    // setup signer
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);

    // Deploy LSP8 Proxy
    console.log('⏳ Deploying LSP8 Proxy');

    const Lsp8ProxyFactory = new ethers.ContractFactory(
        LSP8Proxy.abi,
        LSP8Proxy.bytecode,
    );

    const proxyDeployTx = await Lsp8ProxyFactory.connect(signer).deploy();
    await proxyDeployTx.waitForDeployment();

    try {
        await hre.run("verify:verify", {
            address: proxyDeployTx.target,
            network: NETWORK,
            constructorArguments: [],
            contract: "contracts/LSP8Proxy.sol:LSP8Proxy"
        });
        console.log("Contract verified");
    } catch (error) {
        console.error("Contract verification failed:", error);
    }
    const proxyAddress = proxyDeployTx.target as string;
    console.log('✅ LSP8 Proxy deployed. Address:', proxyAddress);
}

deployLSP8Proxy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
