# Nightfall v3 on Hedera Workshop

This repository contains the code and instructions for the Nightfall v3 on Hedera Workshop, which is designed to help developers understand and work with the Nightfall v3 protocol on the Hedera network. The workshop includes a series of scripts that simplify the process of deploying and interacting with the Nightfall v3 smart contracts on the Hedera network.

> If you want to attend the **live workshop at the Hedera DevDay 2026**, you can follow the instructions in this README and setup eveything in advance. In particular, you can complete the [Prerequisites](#prerequisites), [Initial setup](#initial-setup-4-minutes), and [Contract deployment and circuits setup](#contract-deployment-and-circuits-setup-10-minutes) sections.

## Prerequisites

- [Hedera Portal Account](https://portal.hedera.com/register) with both an ECDSA and ED25519 account.
  - Ensure each account has at least $10 worth of HBARs on the Hedera testnet to cover transaction fees during the workshop.
- [Docker v29+](https://www.docker.com/) with at least 2 GB RAM and 25 GB disk space for Docker images and volumes
- [Docker Compose v5+](https://docs.docker.com/compose/)
- [Node.js v18](https://nodejs.org/)
- Browser wallet extension (e.g. [Rabby Wallet](https://rabby.io/), [MetaMask](https://metamask.io/), etc.) configured to connect to the Hedera testnet:
  - Network Name: Hedera Testnet
  - Chain ID: 296
  - Currency Symbol: HBAR
  - RPC URL: <http://localhost:7546> (we are going to run a local JSON-RPC relay)
  - Block Explorer: <https://hashscan.io/testnet>

### Suggestions

- During the workshop we are going to use [Visual Studio Code](https://code.visualstudio.com/)
- Some utility scripts require [jq](https://jqlang.org/) to be installed on your machine
- [NVM](https://github.com/nvm-sh/nvm) can be used to install and switch between different Node.js versions
- If you install multiple wallet extensions, configure them so they only access sites when clicked (i.e., extension setting: "*This extension can read and change site data → When you click the extension*"). This helps avoid wallet conflicts while using the demo UI.

## Setup environment variables

Consider always having the following environment variables configured in your terminals. You can add them to your shell profile if you want, see `./nightfall_3-workshop/examples/.zshrc.example` for reference:

```shell
# ED25519 key
export NATIVE_ACCOUNT_ID=0.0.xxxx
export NATIVE_ADDRESS=0x000000000...
export NATIVE_PRIVATE_KEY=302e02010....

# ECDSA key
export EVM_ACCOUNT_ID=0.0.xxxx
export EVM_ADDRESS=0xe0b73f....
export EVM_PRIVATE_KEY=0x48b52ab....
```

The native account variables are mostly used in the utility scripts (i.e., `./scripts/create-account`, `./scripts/transfer-hbar`, etc.) and for the JSON-RPC relay, while the EVM variables are mostly used in the EVM related operations (i.e., contract deployment, execution, etc.).

## Repositories

1. Create a folder for the workshop and clone two repositories into it:

```shell
mkdir nightfall-on-hedera
cd nightfall-on-hedera
git clone https://github.com/InternetOfPeers/nightfall_3.git
git clone https://github.com/InternetOfPeers/nightfall_3-workshop.git
```

> Note: The updates created for the Hedera network on the Nightfall projects, which you can find in the InternetOfPeers fork, start from the [aqua_fix_ethsepolia](https://github.com/EYBlockchain/nightfall_3/tree/aqua_fix_ethsepolia) branch of the original Nightfall v3 repository. That branch in fact contains several months more of fixes than the main branch.

## Initial minimal setup (~5 minutes)

1. Navigate to the `nightfall_3` folder
2. The default branch is `hedera` but in case you are on a different branch, switch to the `hedera` branch with the following command:

    ```shell
    git checkout hedera
    ```

3. Run the following commands to build the selected images used in the workshop:

    ```shell
    nvm install 18
    NF_SERVICES_TO_START=client,deployer,optimist,proposer,worker ./bin/setup-nightfall
    ```

    It would take ~5 minutes to build the selected images and setup the environment.

    ```shell
    ✔ Image ghcr.io/eyblockchain/nightfall3-worker:latest         24.2s
    ✔ Image docker-proposer                                       32.7s
    ✔ Image ghcr.io/eyblockchain/nightfall3-optimist:latest       25.5s
    ✔ Image ghcr.io/eyblockchain/nightfall3-deployer:latest       29.1s
    ✔ Image ghcr.io/eyblockchain/nightfall3-client:latest         26.7s
    ```

    > Note. If you prefer to build all the images for using all Nightfall features, regardless of the workshop, let the `NF_SERVICES_TO_START` environment variable unset or void. In that case, it would take ~15 minutes to build all the images.

## Contract deployment and circuits setup (~10 minutes)

To deploy the contracts, you will need an EVM-compatible account on the Hedera network with some HBARs to pay for the deployment fees. You need also a native account to pay in case of Hedera errors (not EVM errors) in the transactions sent by your local JSON-RPC relay. You can create both accounts and get testnet HBARs from the [Hedera Portal](https://portal.hedera.com/register). Although the deployment is going to cost less than $5, it is suggested to fund each account with at least $10 worth of HBARs to easily cover transaction fees and other tests during the workshop.

You can quickly check your accounts balance with the following command:

```shell
./nightfall_3-workshop/scripts/check-balance $EVM_ADDRESS
./nightfall_3-workshop/scripts/check-balance $NATIVE_ACCOUNT_ID
```

If you need to quickly create a new dedicated account, you can use the following command:

```shell
./nightfall_3-workshop/scripts/create-account
```

If you need to quickly transfer funds from your `$NATIVE_ACCOUNT_ID` to fund other accounts, you can use the following command:

```shell
./nightfall_3-workshop/scripts/transfer-dollars 10.00 <0.0.xxx or 0x123...>
./nightfall_3-workshop/scripts/transfer-hbar 100 <0.0.xxx or 0x123...>
```

### Start the JSON-RPC relay

1. Open a new terminal and navigate to `nightfall_3-workshop` folder
2. Check if all the environment variables are available in the new terminal manually or with the following command: `./scripts/check-env-variables`. If any variable is missing, export it in the terminal or add it to your shell profile.
3. Run `./scripts/run-local-json-rpc-relay`

> **Why running a local JSON-RPC relay instead of connecting directly to a public RPC endpoint?** A local relay serves multiple purposes: it allows us to sign native transactions locally with our ED25519 key, it can be configured with different parameters and services (web socket, HTTP, caching, etc.), and it can also provide additional logging and debugging capabilities that are useful during development and testing. In addition, free public RPC endpoints like Hashio are usually protected by rate limits, and using a local relay can help us avoid hitting those limits during the workshop activities.

### Deploy the contracts and setup the circuits

1. Open a new terminal and navigate to the `nightfall_3` folder
2. Check if all the environment variables are available in the new terminal manually or with the following command:

    ```shell
    ../nightfall_3-workshop/scripts/check-env-variables
    ```

    If any variable is missing, export it in the terminal or add it to your shell profile.

3. Ensure the `$EVM_ADDRESS` account has at least **$5 worth of HBARs** on the Hedera testnet to cover the deployment fees:

    ```shell
    ../nightfall_3-workshop/scripts/check-balance $EVM_ADDRESS
    ```

4. Check the configurations in `./bin/hedera-deployment.env` (configurations for the deployer script) and `./.env.deployment.hedera` (configurations for Nightfall services) and update them if needed. **For the sake of the workshop, the configurations are ready to use**, you don't need to change anything. If in the future you want to experiment with this deployment, I suggest to update at least the `MULTISIG_APPROVERS` variable (minimum two accounts) before the deployment so you can control the multisig wallet that will own the contracts after the deployment.

5. Run `./bin/hedera-deployer $EVM_ADDRESS $EVM_PRIVATE_KEY`. It would take ~10 minutes to deploy and setup the contracts, and to generate the keys for the users. Once the deployment is complete, the deployer should exit succesfully and you should see something similar at the end of the deployer logs:

    ```shell
    deployer-1  | [2026-02-09 21:22:19.744] DEBUG: Gas estimated at 36866
    deployer-1  | [2026-02-09 21:22:19.745] DEBUG: Submitting transaction from 0xe0b73F64b0de6032b193648c08899f20b5A6141D to 0x187228fAbc1F0e97d083248797fC9eEDfb2F3eE4 with gas 73732
    deployer-1  | [2026-02-09 21:22:25.332] DEBUG: Got receipt with transaction hash 0xc148894b98a857f0322d03ac44989009e3e003e15bb9b176bd77b8d812d95913
    deployer-1  | [2026-02-09 21:22:25.332] DEBUG: Ownership has been transferred to the Multisig contract: 0x7Dc13FaD0786001d5447fd86aa73cC9bA60f68b4
    deployer-1  | [2026-02-09 21:22:25.332] INFO: deployer bootstrap done
    deployer-1 exited with code 0
    ```

6. Detach from the docker logs with `CTRL+C`.

7. Check the `./docker/volumes` folder. You should see three subfolders `artifacts`, `build`, and `proving_files` containing all the deployed contracts details, the generated keys, the compiled circuits, and the artifacts from the deployment.

8. Retrieve the current Hedera block number and set it as the value for the `STATE_GENESIS_BLOCK` variable in `./.env.deployment.hedera` and `./bin/hedera-node.env`, manually or with the following command:

    ```shell
    ../nightfall_3-workshop/scripts/set-nightfall-genesis-block ./.env.deployment.hedera ./bin/hedera-node.env
    ```

9. Destroy the deployment containers with the following command:

    ```shell
    docker compose -p nightfall_3 down --remove-orphans
    ```

10. Close the current terminal, and leave the terminal running the JSON-RPC relay open, as it will be needed to start Nightfall in the next step.

## Start Nightfall

1. Open a new terminal and navigate to the `nightfall_3` folder
2. Run the following commands to start Nightfall and its services:

    ```shell
    nvm install 18
    source .env.deployment.hedera
    export NF_SERVICES_TO_START=optimist,worker,client,mongodb,mongo-express
    export NF_SERVICES_TO_LOG=optimist,worker,client
    export NO_REMOVE=true
    ./bin/start-nightfall -l -d
    ```

To reduce the noise in the optimist logs, you can toggle the heartbeat logging with the following command:

```shell
curl -X POST http://localhost:8081/debug/toggle-heartbeat-logging \
  -H "Content-Type: application/json" \
  -d '{"heartBeatLogging": "false"}'
```

To check the client's logs more easily, you can open a new terminal and run the following command:

```shell
docker logs -f nightfall_3-client-1
```

You can do the same with the optimist container:

```shell
docker logs -f nightfall_3-optimist-1
```

## Start a Proposer

1. Open a new terminal and navigate to the `nightfall_3` folder
2. Configure the `./bin/hedera-node.env` file with the correct values for your deployment. **For the sake of the workshop, the configurations are ready to use**, you don't need to change anything.
3. Run the following commands to start a proposer that will create the batches of transactions to be submitted on the Hedera network:

    ```shell
    nvm install 18
    source ./bin/hedera-node.env $EVM_ADDRESS $EVM_PRIVATE_KEY http://host.docker.internal:7546
    npm run start-proposer
    ```

## Start the Demo UI

1. Open a new terminal and navigate to the `nightfall_3/demo-ui` folder
2. Run the following commands to start the demo UI:

    ```shell
    nvm install 18
    npm ci
    CONFIRMATIONS=1 npm run start
    ```

## Interact with the demo UI

When you interact with Nightfall you need a ZKP public/private key pair associated to your normal EVM account. Once the funds are sent to the shielded pool, you can use the ZKP Public key of a user to generate the proofs needed to transfer or withdraw the funds. In a real world scenario, users would generate their own ZKP key pair in their wallets and keep the private key safe, but for the sake of simplicity in the workshop, we are going to generate the ZKP keys starting from predefined mnemonics, and we are going to associate those keys to another set of newly generated accounts. Finally, in a real world scenario users should share their public keys with the senders if they want to receive funds; in the demo UI we are going to bypass this step by automatically sharing the ZKP public keys of all the users in the application.

With Nightfall you can decide to move any existing ERC20, ERC721, or ERC1155 token. Fees to the proposer of the block including your transaction are paid in WHBAR for the sake of this workshop, but in a real world scenario the proposer is free to choose to accept other tokens as fees.

Again just for this demo, we are going to transfer WHBAR directly, so the setup and the transactions creation are simpler, but the flows are the same for any other token.

### Wallet setup

1. Navigate to the demo UI at `http://localhost:3000` with your browser.
2. Create two brand new wallet accounts - Carl and Dave - and connect them to the demo.
3. Fund both accounts with 100 HBARs.
4. Send 80 HBARs from Carl to the WHBAR contract, he will get back the same amount of WHBARs.
5. Do the same with Dave.

### Application and users setup

1. Flag the **"Use WHBAR contract address"** option and the **"Connect to: Hedera Testnet"** option, and press **"Configure"**. This will update the demo UI to use the correct contract address for the WHBAR token and to connect to the local JSON-RPC relay that we are running, which is connected to the Hedera testnet.
2. Select Carl's account in your wallet extension, and add Alice user in the app. Insert your own mnemonic in the input field, or chose one of the predefined from the list. This will generate the ZKP keys for Alice and associate them to Carl's EVM account.
3. **Switch to Dave's account in your wallet extension**, and add Bob user in the app. Insert your own mnemonic in the input field, or chose one of the predefined from the list. This will generate the ZKP keys for Bob and associate them to Dave's EVM account.
4. The interface should hide the "Add User" section and now you should see only three options available on the left: **Deposit**, **Transfer**, and **Withdraw**.
5. If everything is correct, swapping between Carl and Dave's accounts in the wallet extension should automatically swap between Alice and Bob users in the application.

The final result after the users setup should be the following:

| Wallet User | EVM Account | L1 Balance         | Nightfall User     | L2 Balance  |
| ----------- | ----------- | ------------------ | ------------------ | ----------- |
| Carl        | 0x123...    | 20 HBAR + 80 WHBAR | Alice              | 0 WHBAR     |
| Dave        | 0x456...    | 20 HBAR + 80 WHBAR | Bob                | 0 WHBAR     |

### Deposit

The deposit operation - sending money from the L1 to the shielded pool - implies always an on-chain transaction.

1. Select Carl's account in your wallet extension. You should notice Alice's account is now selected in the demo UI.
2. Deposit 60.00000010 WHBAR. Alice will receive 60 WHBARs in the shielded pool, and 0.00000010 WHBARs will be used to pay the fee for the proposer.
3. (only the first time) The app will ask to sign the approval for the Nightfall contract to spend Carl's WHBARs, and then the approval transaction will be submitted on the Hedera network. Wait for the transaction to be confirmed.
4. The app now ask to sign the actual deposit transaction. Once submitted, nothing seems to happen yet. The transaction is pending but not in a block or on-chain yet.
5. Select Dave's account in your wallet extension. You should notice Bob's account is now selected in the demo UI.
6. Deposit 50.00000010 WHBAR. Bob will receive 50 WHBARs in the shielded pool, and 0.00000010 WHBARs will be used to pay the fee for the proposer.
7. Repeat the same steps as for Alice to approve and submit the deposit transaction for Bob.
8. Now we have two pending transactions, one for Alice and one for Bob, waiting to be included in a block by the proposer. Instead of waiting for the block to be full and being created, you can speed up the process to force the block creation: press "Make block" button.
9. Switch to the Optimist logs. Notice how the transactions are submitted, how the process get the event notifications from the on-chain transactions by the relay, and how the Optimist process waits for confirmation of the first L2 block. Once the L2 block is confirmed, the transactions are finalized and the commitments included in the state.
10. Switch to the demo UI: Alice's balance should now show 60 WHBARs, and Bob's balance should show 50 WHBARs.

The final result after the deposit step should be the following:

| Wallet User | EVM Account | L1 Balance            | Nightfall User     | L2 Balance  |
| ----------- | ----------- | --------------------- | ------------------ | ----------- |
| Carl        | 0x123...    | ~19.9 HBAR + 20 WHBAR | Alice              | 60 WHBAR    |
| Dave        | 0x456...    | ~19.9 HBAR + 30 WHBAR | Bob                | 50 WHBAR    |

### Transfer

The transfer operation - sending money from a user to another user inside the shielded pool - does not require any on-chain transaction, but it requires the generation of ZKPs and their submission to the Optimist process, which will verify them and include them in the next block for the proposer to submit, or directly to the proposer depending on the configuration of the system.

In case users cannot reach a proposer or an optimist process directly, they can submit a transfer transaction on-chain. No real contract call is executed in this case, but the transaction calldata is used as a signal and data source for the proposer to understand that there are pending transfers to be included in the next block.

In this demo we are going to use the direct submission to the Proposer (that forward the transactions to the Optimist process), so we can keep eveything private and off-chain.

1. Select Carl's account in your wallet extension. You should notice Alice's account is now selected in the demo UI.
2. Select the Transfer function, flag the "Offchain (instant transfer)" option, and send 20.00000010 WHBARs to Bob. Alice will pay 0.00000010 WHBARs as fee.
3. Notice you are not signing any transaction with your wallet account, because the transaction is created and signed locally in the app with Alice's ZKP private key, and then submitted directly to the Proposer.
4. Select Dave's account in your wallet extension. You should notice Bob's account is now selected in the demo UI.
5. Select the Transfer function, flag the "Offchain (instant transfer)" option, and send 40.00000000 WHBARs to Alice. Bob will pay 0.00000010 WHBARs as fee. Please note the fee will be added **on top** of the transfer amount, so make sure to have enough balance to cover both the transfer and the fee.
6. Again as before, notice you are not signing any transaction with your wallet account.
7. Press the "Make the block" and wait for the block to be confirmed by the Optimist process.
8. If the balances don't update automatically, use the "Fetch Balances" button to trigger a manual update.
9. Check the balance for both Alice and Bob in the demo UI. Alice should have now 80 WHBARs, and Bob should have 30 WHBARs. Carl and Dave's balance on the L1 remained the same because they didn't spend any fund. Transaction fees were in fact paid by the Proposer.
10. (Optional) Experiment with another transfer, this time without selecting the "Offchain (instant transfer)" option. This time the app will ask to sign a transaction, the Optimist process will notice that transaction when it will be finalized on-chain and will put that in its mempool. Ask for creating a new block for the Proposer to submit the L2 block and see the balance change after the block confirmation.

The final result after the deposit step should be the following:

| Wallet User | EVM Account | L1 Balance            | Nightfall User     | L2 Balance  |
| ----------- | ----------- | --------------------- | ------------------ | ----------- |
| Carl        | 0x123...    | ~19.9 HBAR + 20 WHBAR | Alice              | 80 WHBAR    |
| Dave        | 0x456...    | ~19.9 HBAR + 30 WHBAR | Bob                | 30 WHBAR    |

### Withdraw

The withdraw operation - sending money from the shielded pool to the L1 - can be executed in two ways: with a normal withdraw, which implies an on-chain transaction and a waiting period of 7 days before the funds are actually available on the user's account; or with an instant withdraw, which implies the generation of ZKPs and their submission to the Optimist process. In this case a liquidity provider can be used to get the funds immediately for an additional fee. The Liquidity provider (not configured for this demo) will be able to redeem the withdraw commitment on-chain and will get the funds in exchange of the off-chain fee agreed

1. Select Carl's account in your wallet extension. You should notice Alice's account is now selected in the demo UI.
2. Select the Withdraw function, set 10.00000000 WHBARs and press "Withdraw". Alice will pay 0.00000010 WHBARs as fee **on top** of the withdrawal amount, and the app will ask to sign the transaction with Carl's wallet account.
3. After signing the transaction, the withdraw transaction is submitted on-chain.
4. Ask for anothe block to be created and wait for the transaction to be confirmed on the Hedera network
5. After 7 days, Carl can redeem the funds sending a new transaction to the contract.
6. On the other side, you can already check Alice's balance in the app and it should be now 10 WHBARs lower.
