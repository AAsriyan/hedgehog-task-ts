import { FC } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { createMintToInstruction } from "@solana/spl-token";

import Modal from "../../UI/Modal";
import { signAndSendRawTransaction } from "../../utils/helpers";

import styles from "../../styles/Home.module.css";

const MintTokens: FC<{ onClose: () => void }> = ({ onClose }) => {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	const mintTokenHandler = async (e: any) => {
		e.preventDefault();
		if (!connection || !wallet) {
			return;
		}

		const mintPubKey = new web3.PublicKey(e.target.mint.value);
		const recipientPubkey = new web3.PublicKey(e.target.recipient.value);
		const amount = e.target.amount.value;

		try {
			const instruction = createMintToInstruction(
				mintPubKey,
				recipientPubkey,
				wallet.publicKey,
				amount
			);
			await signAndSendRawTransaction(connection, wallet, [instruction]);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Modal onClose={onClose}>
			<form onSubmit={mintTokenHandler}>
				<div className={styles.label}>
					<label htmlFor="mint" className={styles["label-fields"]}>
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
				<div className={styles.label}>
					<label htmlFor="recipient" className={styles["label-fields"]}>
						Recipient:
					</label>
					<input
						id="recipient"
						type="text"
						className={styles.input}
						placeholder="Enter Recipient PublicKey"
						required
					/>
				</div>
				<div className={styles.label}>
					<label htmlFor="amount" className={styles["label-fields"]}>
						Amount of Tokens to Mint:
					</label>
					<input
						id="amount"
						type="number"
						className={styles.input}
						placeholder="e.g. 100"
						required
					/>
				</div>
				<div>
					<button className={styles["button-confirm"]} type="submit">
						Mint Tokens
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default MintTokens;
