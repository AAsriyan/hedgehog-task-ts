import {
	Connection,
	Keypair,
	Transaction,
	TransactionInstruction,
	PublicKey
} from "@solana/web3.js";
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
	createTransferInstruction
} from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const signAndSendRawTransaction = async (
	connection: Connection,
	wallet: AnchorWallet,
	instruction: TransactionInstruction[],
	signers: Keypair[] = []
) => {
	const transaction = new Transaction().add(...instruction);
	transaction.feePayer = wallet.publicKey;

	const anyTransaction = transaction;
	anyTransaction.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;
	const signedTransaction = await wallet.signTransaction(transaction);
	signers.forEach((key) => {
		signedTransaction.partialSign(key);
	});
	const rawTransaction = signedTransaction.serialize();
	return await connection.sendRawTransaction(rawTransaction, {
		skipPreflight: false,
		preflightCommitment: "single"
	});
};

export const getOrCreateAssociatedTokenAccountIds = async (
	connection: Connection,
	payerKey: PublicKey,
	ownerKey: PublicKey,
	mintKey: PublicKey
) => {
	const associatedAddress = await getAssociatedTokenAddress(mintKey, ownerKey);
	const accountInfo = await connection.getAccountInfo(associatedAddress);

	if (accountInfo !== null) {
		return { associatedAddress, instruction: null };
	}
	const createAssociatedAccountIx = createAssociatedTokenAccountInstruction(
		payerKey,
		associatedAddress,
		ownerKey,
		mintKey
	);
	return { associatedAddress, instruction: createAssociatedAccountIx };
};

export const sendTokens = async (
	connection: Connection,
	wallet: AnchorWallet,
	sourceAddress: PublicKey,
	receiverAddress: PublicKey,
	mintAddress: PublicKey,
	amount: number | string
) => {
	const { associatedAddress, instruction: instructionAccount } =
		await getOrCreateAssociatedTokenAccountIds(
			connection,
			wallet.publicKey,
			new PublicKey(receiverAddress),
			new PublicKey(mintAddress)
		);
	if (instructionAccount) {
		await signAndSendRawTransaction(connection, wallet, [instructionAccount]);
	}

	const instructionSend = createTransferInstruction(
		new PublicKey(sourceAddress),
		new PublicKey(associatedAddress),
		wallet.publicKey,
		Number(amount)
	);

	return await signAndSendRawTransaction(connection, wallet, [instructionSend]);
};
