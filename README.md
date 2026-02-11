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

## Repositories

1. Create a folder for the workshop and clone two repositories into it:

```shell
mkdir nightfall-on-hedera
cd nightfall-on-hedera
git clone https://github.com/InternetOfPeers/nightfall_3.git
git clone https://github.com/InternetOfPeers/nightfall_3-workshop.git
```

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

To deploy the contracts, you will need an EVM-compatible account on the Hedera network with some HBARs to pay for the deployment fees. You need also a native account to pay for the transactions sent by your local JSON-RPC relay. You can create both accounts and get testnet HBARs from the [Hedera Portal](https://portal.hedera.com/register).

### Setup environment variables

Always use the following environment variables in your terminals from now on (you can add them to your shell profile if you want, see `./nightfall_3-workshop/examples/.zshrc.example` for reference):

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

## Interact with the demo UI (TO BE COMPLETED)

1. Open the demo UI in your browser at `http://localhost:3000`
2. Connect the demo UI to your wallet (e.g. MetaMask)

### Deposit

bob deposit 200
alice deposit 100

make block

bob has 190
alice has 90

### Transfer

bob transfer 65 to alice, but pays 10 as fee, so alice receives 55
alice transfer 20 to bob, but pays 10 as fee, so bob receives 10

make block

bob has 190 - 65 + 10 = 135
alice has 90 + 55 - 20 = 125

### Withdraw

alice withdraws 115 + pays 10 as fee

make block

Alice has 0 left in the shielded pool and she needs to wait 7 days to call the function to reclaim 115 in her account.
