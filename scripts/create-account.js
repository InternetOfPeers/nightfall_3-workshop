const {
    AccountId,
    PrivateKey,
    Client,
    TransferTransaction,
    Hbar,
    AccountCreateTransaction
} = require("@hiero-ledger/sdk");

async function main() {
    let client;
    try {
        // Your account ID and private key from string value
        const MY_ACCOUNT_ID = AccountId.fromString(process.env.EVM_ADDRESS);
        const MY_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY;

        // Pre-configured client for testnet
        client = Client.forTestnet();

        //Set the operator with the account ID and private key
        client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

        //Generate a new key for the account
        const accountPrivateKey = PrivateKey.generateECDSA();
        const accountPublicKey = accountPrivateKey.publicKey;

        const txCreateAccount = new AccountCreateTransaction()
            .setECDSAKeyWithAlias(accountPublicKey)
            //DO NOT set an alias with your key if you plan to update/rotate keys in the future, Use .setKeyWithoutAlias instead 
            //.setKeyWithoutAlias(accountPublicKey)
            .setInitialBalance(new Hbar(100));

        //Sign the transaction with the client operator private key and submit to a Hedera network
        const txCreateAccountResponse = await txCreateAccount.execute(client);

        //Request the receipt of the transaction
        const receiptCreateAccountTx = await txCreateAccountResponse.getReceipt(client);

        //Get the transaction consensus status
        const statusCreateAccountTx = receiptCreateAccountTx.status;

        //Get the Account ID
        const accountId = receiptCreateAccountTx.accountId;

        //Get the Transaction ID 
        const txIdAccountCreated = txCreateAccountResponse.transactionId.toString();

        console.log("------------------------------ Create Account ------------------------------ ");
        console.log("Receipt status       :", statusCreateAccountTx.toString());
        console.log("Transaction ID       :", txIdAccountCreated);
        console.log("Hashscan URL         :", `https://hashscan.io/testnet/transaction/${txIdAccountCreated}`);
        console.log("Account ID           :", accountId.toString());
        console.log("EVM Address          :", `0x${accountPublicKey.toEvmAddress()}`);
        console.log("Private key          :", `0x${accountPrivateKey.toStringRaw()}`);
        console.log("Public key           :", `0x${accountPublicKey.toStringRaw()}`);

    } catch (error) {
        console.error(error);
    } finally {
        if (client) client.close();
        process.exit(0);
    }
}

main();
