# Nightfall v3 Workshop

This repository contains the code and instructions for the Nightfall v3 Workshop, which is designed to help developers understand and work with the Nightfall v3 protocol. The workshop includes a series of scripts that simplify the process of deploying and interacting with the Nightfall v3 smart contracts on the Hedera network.

> Note. If you want to attend the **live workshop at the Hedera DevDay 2026**, you can follow the instructions in this README and setup eveything in advance. In particular, you can complete the [Initial setup](#initial-setup-only-needed-the-first-time) and [Contract deployment](#contract-deployment) sections.

## Repositories

1. Clone two repositories into the same parent folder:

```shell
mkdir nightfall-on-hedera
cd nightfall-on-hedera
git clone https://github.com/InternetOfPeers/nightfall_3.git
git clone https://github.com/InternetOfPeers/nightfall_3-workshop.git
```

## Initial setup (only needed the first time)

1. Navigate to the `nightfall_3` folder
2. Run the following commands:

    ```shell
    nvm install 18; ./bin/setup-nightfall
    ```

    It would take ~15 minutes to build all the images and setup the environment.

    ```shell
    ✔ Image ghcr.io/eyblockchain/nightfall3-administrator:latest Built                               23.0s
    ✔ Image docker-lazy-optimist Built                                                               33.9s
    ✔ Image docker-bad-client    Built                                                               33.0s
    ✔ Image docker-challenger Built                                                                  31.6s
    ✔ Image ghcr.io/eyblockchain/nightfall3-client:latest Built                                      30.4s
    ✔ Image ghcr.io/eyblockchain/nightfall3-deployer:latest Built                                    36.3s
    ✔ Image ghcr.io/eyblockchain/nightfall3-hosted-utils-api-server:latest Built                      4.2s
    ✔ Image ghcr.io/eyblockchain/nightfall3-optimist:latest Built                                    27.2s
    ✔ Image docker-proposer Built                                                                    34.0s
    ✔ Image ghcr.io/eyblockchain/nightfall3-worker:latest Built                                      27.3s
    ✔ Image docker-blockchain Built                                                                 432.8s
    ```

## Contract deployment

To deploy the contracts, you will need an EVM-compatible account on the Hedera network with some HBARs to pay for the deployment fees. You need also a native account to pay for the transactions sent by your local JSON-RPC relay. You can create both accounts and get testnet HBARs from the [Hedera Portal](https://portal.hedera.com/register).

### Setup environment variables

Always use the following environment variables in your terminals from now on (you can add them to your shell profile if you want, see `./examples/.zshrc.example` for reference):

```shell
# ED25119 key
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

### Deploy the contracts

1. Open a new terminal and navigate to the `nightfall_3` folder
2. Check if all the environment variables are available in the new terminal manually or with the following command: `../nightfall_3-workshop/scripts/check-env-variables`. If any variable is missing, export it in the terminal or add it to your shell profile.
3. Edit configurations in `./bin/hedera-deployment.env` (configurations for the deployer script) and `./.env.deployment.hedera` (configurations for Nightfall services) as needed. For the sake of the workshop, you don't need to change anything. If in the future you want to experiment with this deployment, you need to update the `MULTISIG_APPROVERS` variable (at least two accounts) before the deployment so you can control the multisig wallet that will own the contracts after the deployment.
4. Run `./bin/hedera-deployer $EVM_ADDRESS $EVM_PRIVATE_KEY`. It would take ~10 minutes to deploy and setup the contracts, and to generate the keys for the users. Once the deployment is complete, the deployer should exit succesfully and you should see something similar at the end of the deployer logs:

    ```shell
    deployer-1  | [2026-02-09 21:22:19.744] DEBUG: Gas estimated at 36866
    deployer-1  | [2026-02-09 21:22:19.745] DEBUG: Submitting transaction from 0xe0b73F64b0de6032b193648c08899f20b5A6141D to 0x187228fAbc1F0e97d083248797fC9eEDfb2F3eE4 with gas 73732
    deployer-1  | [2026-02-09 21:22:25.332] DEBUG: Got receipt with transaction hash 0xc148894b98a857f0322d03ac44989009e3e003e15bb9b176bd77b8d812d95913
    deployer-1  | [2026-02-09 21:22:25.332] DEBUG: Ownership has been transferred to the Multisig contract: 0x7Dc13FaD0786001d5447fd86aa73cC9bA60f68b4
    deployer-1  | [2026-02-09 21:22:25.332] INFO: deployer bootstrap done
    deployer-1 exited with code 0
    ```

5. Retrieve the current Hedera block number and set it as the value for `STATE_GENESIS_BLOCK` in `./.env.deployment.hedera` manually or with the following command:

    ```shell
    ../nightfall_3-workshop/scripts/set-nightfall-genesis-block ./.env.deployment.hedera
    ```

6. Destroy the deployment containers with the following command:

    ```shell
    docker compose -p nightfall_3 down --remove-orphans
    ```

7. Close the current terminal, and leave the terminal running the JSON-RPC relay open, as it will be needed to start Nightfall in the next step.

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
2. Configure the `./bin/hedera-node.env` file with the correct values for your deployment.
3. Run the following commands to start a proposer that will create the batches of transactions to be submitted on the Hedera network:

    ```shell
    nvm install 18
    source ./bin/hedera-node.env $EVM_PRIVATE_KEY http://host.docker.internal:7546
    npm run start-proposer
    ```

## Start the Demo UI

1. Open a new terminal and navigate to the `nightfall_3/demo-ui` folder
2. Run the following commands to start the demo UI:

    ```shell
    nvm install 18
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