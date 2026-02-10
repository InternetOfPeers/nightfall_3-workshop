const {
    AccountId,
    PrivateKey,
    Client,
    TransferTransaction,
    Hbar
} = require("@hiero-ledger/sdk"); 

async function main() {
    let client;
    try {
        const MY_ACCOUNT_ID = process.env.NATIVE_ACCOUNT_ID
        const MY_PRIVATE_KEY = process.env.NATIVE_PRIVATE_KEY;

        const amount = process.argv[2];
        if (amount == null) {
            throw new Error("Please provide the amount of HBAR to transfer as a command line argument");
        }

        const recipient = process.argv[3];
        if (recipient == null) {
            throw new Error("Please provide the recipient account ID as a command line argument");
        }

        // Pre-configured client for testnet
        client = Client.forTestnet();

        //Set the operator with the account ID and private key
        client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

        //Create a transaction to transfer 1 HBAR
        const txTransfer = new TransferTransaction()
            .addHbarTransfer(MY_ACCOUNT_ID, new Hbar(-amount))
            .addHbarTransfer(recipient, new Hbar(amount));

        //Submit the transaction to a Hedera network
        const txTransferResponse = await txTransfer.execute(client);

        //Request the receipt of the transaction
        const receiptTransferTx = await txTransferResponse.getReceipt(client);

        //Get the transaction consensus status
        const statusTransferTx = receiptTransferTx.status;

        //Get the Transaction ID
        const txIdTransfer = txTransferResponse.transactionId.toString();

        console.log("-------------------------------- Transfer HBAR ------------------------------ ");
        console.log("Receipt status           :", statusTransferTx.toString());
        console.log("Transaction ID           :", txIdTransfer);
        console.log("Hashscan URL             :", `https://hashscan.io/testnet/transaction/${txIdTransfer}`);

    } catch (error) {
        console.error(error);
        process.exit(-1);
    } finally {
        if (client) client.close();
        process.exit(0);
    }
}

main();
