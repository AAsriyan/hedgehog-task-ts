import { FC, useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

import {
	getAssociatedTokenAddress,
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	createAssociatedTokenAccountInstruction
} from "@solana/spl-token";
import Modal from "../../UI/Modal";

import styles from "../../styles/Home.module.css";

const CreateTokenAccount: FC<{ onClose: () => void }> = ({ onClose }) => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const createTokenAccountHandler = async (e: any) => {
		e.preventDefault();
		if (!connection || !publicKey) {
			return;
		}

		try {
			const transaction = new web3.Transaction();
			const mint = new web3.PublicKey(e.target.mint.value);
			const owner = publicKey;

			const associatedToken = await getAssociatedTokenAddress(
				mint,
				owner,
				false,
				TOKEN_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			);

			transaction.add(
				createAssociatedTokenAccountInstruction(
					publicKey,
					associatedToken,
					owner,
					mint,
					TOKEN_PROGRAM_ID,
					ASSOCIATED_TOKEN_PROGRAM_ID
				)
			);

			await sendTransaction(transaction, connection);

			// using this to refresh to populate the new token list.
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Modal onClose={onClose}>
			<form onSubmit={createTokenAccountHandler}>
				<div className={styles.label}>
					<label className={styles["label-fields"]} htmlFor="mint">
						Token Mint:
					</label>
					<input
						id="mint"
						type="text"
						className={styles.input}
						placeholder="Enter Token Mint"
						required
					/>
				</div>
				<div>
					<button className={styles["button-confirm"]} type="submit">
						Create Token Account
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default CreateTokenAccount;
